"""Run meaningful local tests and validate notebook code syntax."""
import ast
import json
from pathlib import Path
import subprocess
import sys
ROOT=Path(__file__).resolve().parent
for folder in ['telco-signal','evidence-search','alzheimer-mri-study']:
    subprocess.run([sys.executable,'-m','unittest','discover','-v'],cwd=ROOT/folder,check=True)
nb=json.loads((ROOT/'alzheimer-mri-study/study.ipynb').read_text())
for i,cell in enumerate(nb['cells']):
    if cell['cell_type']=='code':ast.parse(''.join(cell['source']),filename=f'cell-{i}')
print('Notebook code syntax checked; training not executed.')
