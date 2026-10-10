"""Audit a licensed image manifest before training; never infer patient IDs.

CSV columns: path,label,patient_id. Paths are relative to --root.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path
from sklearn.model_selection import GroupShuffleSplit

def audit(root,manifest,output):
    with manifest.open(newline='') as file:
        rows=list(csv.DictReader(file))
    if not rows or set(rows[0])!={'path','label','patient_id'}:raise ValueError('Expected path,label,patient_id manifest')
    root=root.resolve();seen={};warnings=[]
    for row in rows:
        if not row['patient_id'].strip():raise ValueError('Patient IDs are required; do not infer them from arbitrary filenames')
        path=(root/row['path']).resolve()
        if not path.is_relative_to(root) or not path.is_file():raise ValueError('Missing image or path outside root')
        digest=hashlib.sha256(path.read_bytes()).hexdigest();row['sha256']=digest
        if digest in seen:
            prior=seen[digest]
            if prior['label']!=row['label']:raise ValueError('Identical image with conflicting labels')
            if prior['patient_id']!=row['patient_id']:raise ValueError('Identical image assigned to different patients')
            warnings.append({'duplicate':row['path'],'original':prior['path']})
        else:seen[digest]=row
    # Remove exact duplicates before allocating patient groups.
    unique=list(seen.values());groups=[r['patient_id'] for r in unique]
    if len(set(groups))<10:raise ValueError('At least 10 patient groups required for this protocol')
    train,temp=next(GroupShuffleSplit(n_splits=1,test_size=.3,random_state=42).split(unique,groups=groups))
    remainder=[unique[i] for i in temp]
    val,test=next(GroupShuffleSplit(n_splits=1,test_size=.5,random_state=42).split(remainder,groups=[r['patient_id'] for r in remainder]))
    splits={'train':[unique[i] for i in train],'validation':[remainder[i] for i in val],'test':[remainder[i] for i in test]}
    all_labels={r['label'] for r in unique}
    coverage={s:sorted({r['label'] for r in rs}) for s,rs in splits.items()}
    missing={s:sorted(all_labels-set(labels)) for s,labels in coverage.items() if set(labels)!=all_labels}
    output.mkdir(parents=True,exist_ok=True)
    for split,items in splits.items():
        with (output/f'{split}.csv').open('w',newline='') as f:
            w=csv.DictWriter(f,fieldnames=['path','label','patient_id','sha256']);w.writeheader();w.writerows(items)
    report={'images':len(rows),'unique_images':len(unique),'patients':len(set(groups)),'duplicates':warnings,'class_coverage':coverage,'missing_classes':missing,'ready_for_training':not bool(missing),'notes':['GroupShuffleSplit is not stratified. Inspect missing_classes before training.','Exact byte hashes do not detect near-duplicate or re-encoded images.','Patient identity correctness depends on the supplied manifest.','70/15/15 proportions are approximate at patient level.']}
    (output/'audit.json').write_text(json.dumps(report,indent=2))
    return report

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',required=True,type=Path);p.add_argument('--manifest',required=True,type=Path);p.add_argument('--output',default=Path('artifacts/audit'),type=Path);a=p.parse_args();print(json.dumps(audit(a.root,a.manifest,a.output),indent=2))
