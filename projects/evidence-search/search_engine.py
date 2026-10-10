"""Offline retrieval laboratory: BM25, character TF-IDF and rank fusion.

Responses are extracts with citations. No LLM or generated answer is claimed.
"""
from __future__ import annotations
import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import re
import unicodedata
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

STOP=set('le la les un une des du de d et est en au aux pour par que qui quel quelle comment a à the of and to is in how what with'.split())

def tokens(text):
    text=''.join(c for c in unicodedata.normalize('NFKD',text.lower()) if not unicodedata.combining(c))
    return [t for t in re.findall(r'[a-z0-9]+',text) if t not in STOP and len(t)>1]

def load_chunks(root: Path):
    chunks=[]
    for path in sorted(root.glob('*.md')):
        text=path.read_text()
        # Section boundaries preserve a useful source and heading for citations.
        title=text.splitlines()[0].lstrip('# ').strip()
        sections=re.split(r'\n(?=## )',text)
        for index,section in enumerate(sections):
            heading=section.splitlines()[0].lstrip('# ').strip()
            if len(section.strip())<30 or not any(line.strip() and not line.startswith('#') for line in section.splitlines()): continue
            content=section.strip()
            chunks.append({'id':f'{path.stem}:{index}', 'source':path.name, 'title':title,'heading':heading,'text':content,'sha256':hashlib.sha256(content.encode()).hexdigest()})
    if not chunks: raise ValueError('Corpus contains no Markdown sections')
    return chunks

class SearchEngine:
    def __init__(self, root: Path):
        self.chunks=load_chunks(root)
        self.counts=[Counter(tokens(c['text'])) for c in self.chunks]
        self.lengths=np.array([sum(c.values()) for c in self.counts])
        self.avglen=max(1,float(self.lengths.mean()))
        n=len(self.counts)
        df=Counter(t for c in self.counts for t in c)
        self.idf={t:math.log(1+(n-count+.5)/(count+.5)) for t,count in df.items()}
        self.vectorizer=TfidfVectorizer(analyzer='char_wb',ngram_range=(3,5),lowercase=True,strip_accents='unicode')
        self.matrix=self.vectorizer.fit_transform(c['text'] for c in self.chunks)
    def scores(self, query, mode):
        q=tokens(query)
        if not q: return np.zeros(len(self.chunks))
        bm=np.zeros(len(self.chunks))
        for term in set(q):
            tf=np.array([c.get(term,0) for c in self.counts])
            bm+=self.idf.get(term,0)*tf*2.5/(tf+1.5*(.25+.75*self.lengths/self.avglen))
        char=(self.matrix @ self.vectorizer.transform([query]).T).toarray().ravel()
        if mode=='bm25': return bm
        if mode=='tfidf': return char
        if mode!='hybrid': raise ValueError('Unknown search mode')
        # Reciprocal rank fusion: no assumption that BM25 and cosine scores share units.
        fused=np.zeros(len(self.chunks))
        for scores in [bm,char]:
            order=np.argsort(-scores,kind='stable')
            for rank,index in enumerate(order,1):
                if scores[index]>0: fused[index]+=1/(60+rank)
        return fused
    def search(self, query, mode='hybrid', k=3):
        if not isinstance(query,str) or not query.strip() or len(query)>1000: raise ValueError('Query must contain 1–1000 characters')
        if not isinstance(k,int) or isinstance(k,bool) or not 1<=k<=10: raise ValueError('k must be between 1 and 10')
        scores=self.scores(query,mode)
        ranked=np.argsort(-scores,kind='stable')[:k]
        return [{**self.chunks[i],'score':float(scores[i])} for i in ranked if scores[i]>0]
    def confidence(self,query):
        # Cosine is a matching signal, never a factual correctness probability.
        scores=self.scores(query,'tfidf')
        return float(scores.max(initial=0))
    def answer(self,query,threshold=.18,mode='hybrid'):
        hits=self.search(query,mode)
        confidence=self.confidence(query)
        if not hits or confidence<threshold:
            return {'status':'abstained','answer':'Le corpus ne fournit pas de passage suffisamment proche.','confidence':confidence,'threshold':threshold,'citations':[],'answer_type':'extractive'}
        hit=hits[0]
        # Return exact text, not an unsupported paraphrase or instruction execution.
        return {'status':'answered','answer':hit['text'],'confidence':confidence,'threshold':threshold,'citations':[{'source':hit['source'],'chunk_id':hit['id'],'sha256':hit['sha256']}],'hits':hits,'answer_type':'extractive'}

def evaluate(engine, cases, mode, threshold):
    rows=[]; reciprocal=[]; recalls=[]; decisions=[]
    for case in cases:
        hits=engine.search(case['query'],mode,3)
        relevant=case['relevant_sources']
        ranks=[i+1 for i,h in enumerate(hits) if h['source'] in relevant]
        result=engine.answer(case['query'],threshold,mode)
        decisions.append((result['status']=='answered')==bool(relevant))
        if relevant:
            reciprocal.append(1/min(ranks) if ranks else 0)
            recalls.append(len(set(h['source'] for h in hits)&set(relevant))/len(set(relevant)))
        rows.append({'query':case['query'],'relevant_sources':relevant,'retrieved_sources':[h['source'] for h in hits],'status':result['status'],'confidence':result['confidence'],'first_relevant_rank':min(ranks) if ranks else None})
    negatives=[r for r in rows if not r['relevant_sources']]
    positives=[r for r in rows if r['relevant_sources']]
    return {'mrr_at_3':float(np.mean(reciprocal)) if reciprocal else 0,'recall_at_3':float(np.mean(recalls)) if recalls else 0,'answerability_accuracy':float(np.mean(decisions)),'negative_abstention_rate':sum(r['status']=='abstained' for r in negatives)/max(1,len(negatives)),'positive_coverage':sum(r['status']=='answered' for r in positives)/max(1,len(positives)),'cases':rows}

def benchmark(root: Path, output: Path):
    engine=SearchEngine(root/'corpus')
    data=json.loads((root/'evaluation.json').read_text())
    # Threshold calibrated only on development answerability labels.
    dev=data['development']; heldout=data['test']
    thresholds=np.linspace(.08,.4,33)
    threshold=max(thresholds,key=lambda t:evaluate(engine,dev,'hybrid',float(t))['answerability_accuracy'])
    report={'data_origin':'authored_demo_runbooks_and_queries','corpus_chunks':len(engine.chunks),'threshold':float(threshold),'threshold_selection':'development_answerability_accuracy; lowest threshold on ties','development_cases':len(dev),'test_cases':len(heldout),'limitations':['Small authored benchmark; not independently collected','Character TF-IDF is lexical, not a neural embedding','Extractive responses; no LLM generation','No proof of semantic correctness from cosine similarity'],'test':{mode:evaluate(engine,heldout,mode,float(threshold)) for mode in ['bm25','tfidf','hybrid']},'corpus_sha256':hashlib.sha256(''.join(c['sha256'] for c in engine.chunks).encode()).hexdigest()}
    output.mkdir(parents=True,exist_ok=True)
    (output/'benchmark.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    (output/'config.json').write_text(json.dumps({'threshold':float(threshold)}))
    return report

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path('.'));p.add_argument('--output',type=Path,default=Path('artifacts'));a=p.parse_args()
    r=benchmark(a.root,a.output);print(json.dumps({m:{k:v for k,v in metrics.items() if k!='cases'} for m,metrics in r['test'].items()},indent=2))
