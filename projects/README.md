# Engineering projects

Executable AI-assisted portfolio prototypes by Malika Fofana, plus a prepared academic study with Klara Mladenovic.

| Project | Run and inspect |
|---|---|
| [Telco Signal](telco-signal/) | SQL ingestion, temporal ML, quality reports and a localhost scoring dashboard |
| [Evidence Search](evidence-search/) | Lexical retrieval methods, citations, abstention and held-out evaluation |
| [Alzheimer MRI](alzheimer-mri-study/) | Historical notebook, original results, limitations and patient-group audit |

Use Python 3.12 for the two new demos and audit utility. From the repository root:

```bash
python -m pip install -r projects/telco-signal/requirements.txt
python projects/run_checks.py
```

Each project README gives its complete launch commands. The medical training notebook needs a separate environment; training is not executed in CI. No medical data or trained weights are included. Synthetic benchmarks are explicitly labelled and are not claims of real customer performance.

This repository groups the projects without changing the visibility of any private source repository. The portfolio website remains alongside the technical case studies at [Engineering Lab](https://malikafofana.github.io/portfolio/technical.html).
