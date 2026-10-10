# Recherche documentaire

## BM25 et TF-IDF
BM25 classe les passages à partir de la fréquence des mots et de leur rareté dans le corpus. TF-IDF avec n-grammes de caractères tolère certaines variations orthographiques. Ces deux techniques sont lexicales; elles ne remplacent pas des embeddings sémantiques neuronaux.

## Fusion de classement
Reciprocal Rank Fusion additionne les inverses des rangs avec une constante de lissage. Elle combine des classements dont les scores ne sont pas directement comparables. Un document avec score nul ne doit pas recevoir de contribution.
