import csv
import tempfile
import unittest
from pathlib import Path
from audit_dataset import audit

class AuditTests(unittest.TestCase):
    def test_group_isolation_and_deduplication(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);rows=[]
            for patient in range(30):
                for image in range(2):
                    name=f'{patient}-{image}.jpg';(root/name).write_bytes(f'fixture-{patient}-{image}'.encode());rows.append([name,str(patient%2),str(patient)])
            rows.append(rows[0])
            m=root/'manifest.csv'
            with m.open('w',newline='') as f:
                w=csv.writer(f);w.writerow(['path','label','patient_id']);w.writerows(rows)
            r=audit(root,m,root/'out');self.assertEqual(r['unique_images'],60)
            sets=[]
            for split in ['train','validation','test']:
                with (root/'out'/f'{split}.csv').open() as f:sets.append({x['patient_id'] for x in csv.DictReader(f)})
            self.assertFalse(sets[0]&sets[1] or sets[0]&sets[2] or sets[1]&sets[2])
    def test_missing_patient_is_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);m=root/'manifest.csv';m.write_text('path,label,patient_id\nx.jpg,Mild,\n')
            with self.assertRaises(ValueError):audit(root,m,root/'out')

if __name__=='__main__':unittest.main()
