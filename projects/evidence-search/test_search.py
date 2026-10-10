import tempfile
import unittest
from pathlib import Path
from search_engine import SearchEngine, benchmark, tokens

class SearchTests(unittest.TestCase):
    def setUp(self): self.engine=SearchEngine(Path('corpus'))
    def test_citation_is_exact_and_traceable(self):
        a=self.engine.answer('Comment rejouer un import CSV sans doublons ?',threshold=0)
        self.assertEqual(a['status'],'answered')
        hit=next(c for c in self.engine.chunks if c['id']==a['citations'][0]['chunk_id'])
        self.assertEqual(a['answer'],hit['text'])
        self.assertEqual(a['citations'][0]['sha256'],hit['sha256'])
    def test_empty_and_invalid_query(self):
        for query in ['', ' '*5, 'a'*1001]:
            with self.assertRaises(ValueError):self.engine.search(query)
        with self.assertRaises(ValueError):self.engine.search('data',k=0)
    def test_no_overlap_abstains(self):
        a=self.engine.answer('zzzzqqqqxxxx',threshold=.1)
        self.assertEqual(a['status'],'abstained');self.assertEqual(a['citations'],[])
    def test_ties_are_deterministic(self):
        self.assertEqual(self.engine.search('data'),self.engine.search('data'))
    def test_accent_normalisation(self):self.assertEqual(tokens('Événements'),tokens('evenements'))
    def test_corpus_changes_hash(self):
        import json
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);(root/'corpus').mkdir()
            (root/'corpus/a.md').write_text('# Test\n\n## Data\nLes événements ont un identifiant unique et stable.')
            first=SearchEngine(root/'corpus').chunks[0]['sha256']
            (root/'corpus/a.md').write_text('# Test\n\n## Data\nLes événements ont une nouvelle règle différente.')
            self.assertNotEqual(first,SearchEngine(root/'corpus').chunks[0]['sha256'])
    def test_benchmark(self):
        with tempfile.TemporaryDirectory() as d:
            r=benchmark(Path('.'),Path(d))
            self.assertEqual(set(r['test']),{'bm25','tfidf','hybrid'})
            self.assertGreater(r['test_cases'],10)

if __name__=='__main__':unittest.main()
