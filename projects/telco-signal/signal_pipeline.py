"""Reproducible local data platform for 30-day inactivity forecasting.

All bundled data is generated; it contains no Orange customer records.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import json
import sqlite3
from datetime import date, timedelta
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, f1_score, precision_score, recall_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

FEATURES = ['active_days_7', 'active_days_30', 'days_since_activity', 'units_7', 'units_30', 'recent_share']
START = date(2025, 1, 1)

def generate(path: Path, customers=600, days=240, seed=42):
    """Generate a Markov activity process with individual propensity and drift.

    Dormancy is persistent, but new episodes can begin unpredictably. Labels
    are subsequently measured from events; they are never input features.
    """
    rng = np.random.default_rng(seed)
    rows = []
    for customer in range(customers):
        propensity = rng.uniform(.15, .9)
        dormant = rng.random() < .15
        for day in range(days):
            if dormant:
                dormant = not (rng.random() < .012)
            elif rng.random() < .009 + .007 * (day >= 180):
                dormant = True
            if not dormant and rng.random() < propensity:
                rows.append([f'{customer}:{day}', f'SYN-{customer:05d}', (START + timedelta(days=day)).isoformat(), round(float(rng.lognormal(2, .7)), 3)])
    # Real pipeline failure modes: replay, impossible values and malformed date.
    rows.extend(rows[:10])
    rows.extend([['bad-negative', 'SYN-00000', START.isoformat(), -1], ['bad-date', 'SYN-00000', 'invalid', 1]])
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='') as f:
        writer = csv.writer(f); writer.writerow(['event_id', 'customer_id', 'event_date', 'units']); writer.writerows(rows)
    return {'customers': customers, 'days': days, 'seed': seed, 'data_origin': 'synthetic_markov_process'}

def connect(path):
    db = sqlite3.connect(path)
    db.execute('CREATE TABLE IF NOT EXISTS events (event_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, event_date TEXT NOT NULL, units REAL NOT NULL CHECK(units >= 0))')
    db.execute('CREATE INDEX IF NOT EXISTS customer_date ON events(customer_id,event_date)')
    return db

def ingest(path: Path, db: sqlite3.Connection, quarantine: Path):
    inserted = duplicates = 0
    rejected = []
    with path.open(newline='') as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != ['event_id', 'customer_id', 'event_date', 'units']:
            raise ValueError('CSV schema mismatch')
        with db:
            for line, row in enumerate(reader, 2):
                try:
                    if not row['event_id'] or not row['customer_id']:
                        raise ValueError('Missing identifier')
                    d = date.fromisoformat(row['event_date'])
                    value = float(row['units'])
                    if not np.isfinite(value) or value < 0:
                        raise ValueError('Units must be finite and nonnegative')
                    existing = db.execute('SELECT customer_id,event_date,units FROM events WHERE event_id=?', (row['event_id'],)).fetchone()
                    payload = (row['customer_id'], d.isoformat(), value)
                    if existing:
                        if tuple(existing) != payload:
                            raise ValueError('Conflicting event ID')
                        duplicates += 1
                    else:
                        db.execute('INSERT INTO events VALUES (?,?,?,?)', (row['event_id'], *payload)); inserted += 1
                except (ValueError, TypeError, KeyError) as error:
                    rejected.append({'line': line, 'reason': str(error), 'row': row})
    quarantine.write_text(json.dumps(rejected, indent=2))
    return {'inserted': inserted, 'duplicates': duplicates, 'rejected': len(rejected), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

def build_snapshot(db, cutoff: date, customers, labelled=True, observed_until=None):
    """Use [cutoff-30,cutoff) features and [cutoff,cutoff+30) label.

    Customers come from a known roster, including those with zero events.
    An explicit coverage watermark is required for labelled snapshots.
    """
    if labelled and (observed_until is None or observed_until < cutoff + timedelta(days=30)):
        raise ValueError('Incomplete future coverage: cannot assign inactivity labels')
    history = pd.read_sql_query('SELECT * FROM events WHERE event_date < ?', db, params=[cutoff.isoformat()])
    if len(history):
        history['event_date'] = pd.to_datetime(history['event_date'])
    target = {}
    if labelled:
        target = dict(db.execute('SELECT customer_id, COUNT(*) FROM events WHERE event_date >= ? AND event_date < ? GROUP BY customer_id', (cutoff.isoformat(), (cutoff+timedelta(days=30)).isoformat())))
    grouped = {k:g for k,g in history.groupby('customer_id')} if len(history) else {}
    rows=[]
    for cid in customers:
        g = grouped.get(cid)
        if g is None:
            a7=a30=u7=u30=0; gap=30
        else:
            recent=g[g.event_date >= pd.Timestamp(cutoff-timedelta(days=30))]
            last7=recent[recent.event_date >= pd.Timestamp(cutoff-timedelta(days=7))]
            a7=last7.event_date.nunique(); a30=recent.event_date.nunique()
            u7=float(last7.units.sum()); u30=float(recent.units.sum())
            gap=min(30, (cutoff-g.event_date.max().date()).days)
        row={'customer_id':cid, 'cutoff':cutoff.isoformat(), 'active_days_7':a7, 'active_days_30':a30, 'days_since_activity':gap, 'units_7':u7, 'units_30':u30, 'recent_share':u7/u30 if u30 else 0.0}
        if labelled: row['inactive_next_30d']=int(target.get(cid,0)==0)
        rows.append(row)
    return pd.DataFrame(rows)

def measures(y, prob, threshold):
    pred=prob >= threshold
    return {'pr_auc':float(average_precision_score(y,prob)), 'brier':float(brier_score_loss(y,prob)), 'f1':float(f1_score(y,pred,zero_division=0)), 'precision':float(precision_score(y,pred,zero_division=0)), 'recall':float(recall_score(y,pred,zero_division=0)), 'threshold':float(threshold)}

def psi(reference, current):
    edges=np.unique(np.quantile(reference, np.linspace(0,1,11)))
    if len(edges)<2: return 0.0
    edges[0]=-np.inf; edges[-1]=np.inf
    p=np.histogram(reference,bins=edges)[0]/len(reference)
    q=np.histogram(current,bins=edges)[0]/len(current)
    p=np.maximum(p,1e-6); q=np.maximum(q,1e-6)
    return float(np.sum((p-q)*np.log(p/q)))

def experiment(output: Path):
    output.mkdir(parents=True,exist_ok=True)
    raw=output/'events.csv'; metadata=generate(raw)
    db=connect(output/'warehouse.sqlite')
    db.execute('DELETE FROM events'); db.commit()
    quality=ingest(raw,db,output/'quarantine.json')
    replay=ingest(raw,db,output/'quarantine.json')
    roster=[f'SYN-{i:05d}' for i in range(metadata['customers'])]
    def snapshot(day):
        return build_snapshot(db,START+timedelta(days=day),roster,observed_until=START+timedelta(days=metadata['days']))
    train=pd.concat([snapshot(60),snapshot(90),snapshot(120)],ignore_index=True)
    val=snapshot(150); test=snapshot(180)
    # Training labels end before validation features are observed; no future features.
    models={'dummy':DummyClassifier(strategy='prior'), 'logistic':make_pipeline(StandardScaler(),LogisticRegression(max_iter=1000,random_state=42)), 'forest':RandomForestClassifier(n_estimators=120,max_depth=6,min_samples_leaf=8,random_state=42,n_jobs=1)}
    results={}; fitted={}
    for name,model in models.items():
        model.fit(train[FEATURES],train.inactive_next_30d)
        p=model.predict_proba(val[FEATURES])[:,1]
        thresholds=np.linspace(.1,.9,33)
        threshold=max(thresholds,key=lambda t:f1_score(val.inactive_next_30d,p>=t,zero_division=0))
        results[name]={'validation':measures(val.inactive_next_30d,p,threshold)}; fitted[name]=(model,threshold)
    chosen=max(results,key=lambda n:results[n]['validation']['pr_auc'])
    # Model and threshold selection are sealed before test metrics are calculated.
    for name,(model,threshold) in fitted.items():
        results[name]['test']=measures(test.inactive_next_30d,model.predict_proba(test[FEATURES])[:,1],threshold)
    model,threshold=fitted[chosen]
    scored=test[['customer_id','cutoff']].copy()
    scored['risk']=model.predict_proba(test[FEATURES])[:,1]
    scored['actual']=test.inactive_next_30d
    scored['flagged']=(scored.risk>=threshold).astype(int)
    scored=scored.sort_values('risk',ascending=False)
    scored.to_csv(output/'scores.csv',index=False)
    gold=pd.concat([train,val,test],ignore_index=True)
    gold.to_sql('features',db,if_exists='replace',index=False); db.close()
    gold.to_csv(output/'features.csv',index=False)
    import sklearn,sys
    report={'origin':metadata,'runtime':{'python':sys.version.split()[0],'sklearn':sklearn.__version__,'numpy':np.__version__,'pandas':pd.__version__},'quality':quality,'replay':replay,'selection':chosen,'models':results,'split':{'train_cutoff_days':[60,90,120],'validation_cutoff_day':150,'test_cutoff_day':180,'target_horizon_days':30,'same_customers_over_time':True},'prevalence':{s:float(d.inactive_next_30d.mean()) for s,d in [('train',train),('validation',val),('test',test)]},'psi':{f:psi(train[f].to_numpy(),test[f].to_numpy()) for f in FEATURES},'top_scores':scored.head(20).round(5).to_dict(orient='records')}
    (output/'report.json').write_text(json.dumps(report,indent=2))
    # Portable logistic scoring artifact avoids executing pickle files.
    scaler,lr=fitted['logistic'][0].steps[0][1],fitted['logistic'][0].steps[1][1]
    artifact={'model':'logistic','features':FEATURES,'mean':scaler.mean_.tolist(),'scale':scaler.scale_.tolist(),'coef':lr.coef_[0].tolist(),'intercept':float(lr.intercept_[0]),'threshold':float(fitted['logistic'][1]),'data_origin':'synthetic'}
    (output/'logistic.json').write_text(json.dumps(artifact,indent=2))
    return report

def predict(artifact, values):
    if set(values)!=set(artifact['features']): raise ValueError('Supply exactly the six feature names')
    x=np.array([values[f] for f in artifact['features']],dtype=float)
    if not np.isfinite(x).all() or (x<0).any(): raise ValueError('Features must be finite and nonnegative')
    if x[0]>7 or x[1]>30 or x[0]>x[1] or x[2]>30 or x[3]>x[4] or x[5]>1: raise ValueError('Inconsistent feature bounds')
    z=float(((x-np.array(artifact['mean']))/artifact['scale']) @ artifact['coef']+artifact['intercept'])
    probability=float(1/(1+np.exp(-np.clip(z,-700,700))))
    return {'probability':probability,'flagged':probability>=artifact['threshold'],'model':'logistic','threshold':artifact['threshold'],'data_origin':'synthetic'}

if __name__=='__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--output',type=Path,default=Path('artifacts'))
    args=parser.parse_args(); result=experiment(args.output)
    print(json.dumps({'selected':result['selection'],'test':result['models'][result['selection']]['test'],'quality':result['quality']},indent=2))
