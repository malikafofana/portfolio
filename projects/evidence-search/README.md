<div align="center">

# Evidence Search
### Retrieve. Compare. Cite. Abstain.
**Retrieval engineering · BM25 · Character TF-IDF · RRF · Evaluation · API**

</div>

A working offline laboratory for the retrieval layer of source-grounded AI applications. Inspired by Malika Fofana's experience with JurisIA and traceable sources, but built independently on authored engineering runbooks. It compares methods, returns exact extracts with content hashes, and exposes an interactive search API.

**No LLM generation or neural embeddings are implemented.** This is an evaluated retrieval component you can later connect to a RAG application. AI-assisted preparation is documented in [WALKTHROUGH.md](WALKTHROUGH.md).

## Run it

Python 3.12, no GPU or API key:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python search_engine.py
python -m unittest discover -v
python serve.py
```

Open http://127.0.0.1:8012. Choose a method, ask a question and inspect the exact source extract. Add Markdown files to `corpus/`, rerun the benchmark and restart the server to reindex.

## Design

Markdown is chunked at section headings. Each chunk keeps its filename, heading and SHA256. Word BM25 is accent-normalized; character TF-IDF uses 3–5-grams. Hybrid search combines rankings through Reciprocal Rank Fusion; zero-score hits contribute nothing.

The answer is the highest-ranked **exact extract**, not a paraphrase. A separately calibrated cosine threshold allows abstention. Cosine similarity is not a factual confidence probability. Retrieved content is displayed as text and never executed.

## Measured comparison

Authored fixture: 9 documents, 18 chunks; 8 development questions; 24 held-out questions (18 answerable, 6 outside the corpus). Threshold selected only on development answerability accuracy. Questions are distinct, but both sets were authored for this corpus and are not an independent benchmark.

| Method | MRR@3 | Recall@3 | Abstention on 6 unsupported questions |
|---|---:|---:|---:|
| BM25 | 0.843 | 0.944 | 0.667 |
| Character TF-IDF | 0.972 | 1.000 | 0.500 |
| Hybrid RRF | 0.852 | 0.944 | 0.500 |

**The hybrid does not win this fixture.** TF-IDF retrieves sources better here; BM25 abstains more often on unsupported questions. Hybrid and TF-IDF still falsely answer 3 of 6 unsupported questions. Full failures: [artifacts/benchmark.json](artifacts/benchmark.json). The dashboard lets you compare all three rather than advertising one as universally best.

Recall@3 counts relevant source files, not all passages. MRR@3 measures the first relevant retrieved chunk. These retrieval metrics exclude unanswerable questions; coverage and negative abstention are reported separately.

## API

```bash
curl -X POST http://127.0.0.1:8012/api/search \\
  -H 'Content-Type: application/json' \\
  -d '{"query":"Comment éviter la fuite temporelle ?","mode":"hybrid"}'
```

`GET /health` reports indexed chunk count; `GET /api/report` exposes metrics; `POST /api/search` returns status, extract and citations. Inputs are limited to 1000 characters and 8192 request bytes. The demo binds to localhost and is not hardened for deployment.

## Credible extensions

Next experiments: a licensed public corpus, independent query annotations, dense embeddings with a measurable ablation, reranking, latency distribution, and an LLM adapter evaluated separately for faithfulness. Those extensions are not currently implemented. Retrieval provenance enables auditing; it does not guarantee correct or safe answers.

