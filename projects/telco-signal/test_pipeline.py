import csv
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
from datetime import timedelta
import numpy as np
from signal_pipeline import connect, ingest, build_snapshot, START, predict, experiment, FEATURES

class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.root=Path(self.tmp.name)
        self.db=connect(self.root/'test.sqlite')
    def tearDown(self):
        self.db.close(); self.tmp.cleanup()
    def write(self, rows):
        path=self.root/'in.csv'
        with path.open('w',newline='') as f:
            w=csv.writer(f);w.writerow(['event_id','customer_id','event_date','units']);w.writerows(rows)
        return path
    def test_replay_quarantine_and_conflicts(self):
        p=self.write([['a','c',START.isoformat(),2],['a','c',START.isoformat(),2],['a','c',START.isoformat(),5],['b','c','bad',3],['c','c',START.isoformat(),float('nan')]])
        report=ingest(p,self.db,self.root/'q.json')
        self.assertEqual([report[k] for k in ['inserted','duplicates','rejected']],[1,1,3])
        self.assertEqual(ingest(p,self.db,self.root/'q.json')['inserted'],0)
    def test_future_events_do_not_change_features(self):
        cutoff=START+timedelta(days=30)
        p=self.write([['a','c',(cutoff-timedelta(days=1)).isoformat(),4]])
        ingest(p,self.db,self.root/'q.json')
        before=build_snapshot(self.db,cutoff,['c','no-events'],observed_until=cutoff+timedelta(days=30))
        self.db.execute('INSERT INTO events VALUES (?,?,?,?)',('future','c',cutoff.isoformat(),999));self.db.commit()
        after=build_snapshot(self.db,cutoff,['c','no-events'],observed_until=cutoff+timedelta(days=30))
        np.testing.assert_array_equal(before[FEATURES],after[FEATURES])
        self.assertEqual(before.iloc[0].inactive_next_30d,1)
        self.assertEqual(after.iloc[0].inactive_next_30d,0)
        self.assertEqual(after.iloc[1].inactive_next_30d,1)
    def test_incomplete_future_is_not_inactivity(self):
        with self.assertRaises(ValueError): build_snapshot(self.db,START,['c'])
    def test_schema_error(self):
        p=self.root/'bad.csv';p.write_text('x,y\n1,2\n')
        with self.assertRaises(ValueError): ingest(p,self.db,self.root/'q.json')
    def test_predictions_validate_bounds(self):
        a={'features':FEATURES,'mean':[0]*6,'scale':[1]*6,'coef':[0]*6,'intercept':0,'threshold':.5}
        self.assertEqual(predict(a,dict(zip(FEATURES,[1,2,3,4,5,.8])))['probability'],.5)
        with self.assertRaises(ValueError): predict(a,dict(zip(FEATURES,[9,2,3,4,5,.8])))
        with self.assertRaises(ValueError): predict(a,{'x':1})
    def test_full_experiment(self):
        r=experiment(self.root/'artifacts')
        self.assertEqual(r['replay']['inserted'],0)
        self.assertEqual(r['quality']['rejected'],2)
        self.assertEqual(len(r['models']),3)
        self.assertTrue((self.root/'artifacts/logistic.json').exists())

if __name__=='__main__': unittest.main()
