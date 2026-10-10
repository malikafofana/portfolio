# Comprendre Evidence Search

Cette base est préparée avec assistance IA et adaptée à ton expérience de RAG. Elle démontre la recherche et l'évaluation; elle ne génère pas de réponse avec un LLM.

1. Lance les trois méthodes sur la même question. Lis les passages et compare les rangs.
2. Ouvre `artifacts/benchmark.json`. Trouve les trois questions hors corpus auxquelles l'hybride répond à tort.
3. Explique la différence entre MRR, Recall@3 et taux d'abstention.
4. Augmente le seuil d'abstention : quelles réponses utiles perd-on ? Le test ne doit pas servir à sélectionner ton seuil final.
5. Modifie un paragraphe et observe le nouveau SHA256. Pourquoi est-ce utile pour la traçabilité ?
6. Ajoute un document long avec plusieurs sections; observe le découpage.
7. Écris un nouveau jeu de questions sans reprendre les formulations du corpus. Compare les résultats avant de revendiquer la qualité.

**Pourquoi la fusion est moins bonne ?** Elle combine aussi les erreurs des classements. Une méthode plus complexe n'est pas automatiquement supérieure.

**Est-ce un RAG ?** C'est son composant de retrieval et une interface extractive. Aucun modèle génératif n'est branché.

**Est-ce JurisIA ?** Non. C'est une démonstration indépendante, sans code d'entreprise ni données Légifrance.

**Peut-on dire que les réponses sont fiables à 100 % ?** Non. Les citations rendent les sources inspectables et le benchmark documente encore de fausses réponses.

