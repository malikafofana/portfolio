# Comprendre et défendre Telco Signal

Projet de portfolio préparé avec assistance IA à partir de ton expérience B2B. Le code est exécutable; les données et les scores sont synthétiques. Tu pourras le présenter comme un projet personnel assisté après l'avoir lancé et pris en main.

1. Lance `python signal_pipeline.py`, lis le rapport et compare la PR-AUC du modèle au taux de positifs.
2. Ouvre SQLite et exécute `SELECT COUNT(*) FROM events;` puis `SELECT cutoff, AVG(inactive_next_30d) FROM features GROUP BY cutoff;`.
3. Relance l'ingestion : pourquoi une clé unique ne suffit-elle pas à détecter un événement modifié ? Regarde le test de conflit.
4. Dessine les deux fenêtres [T−30,T) et [T,T+30). Ajoute un événement futur et vérifie que seules les étiquettes changent.
5. Compare précision et rappel au seuil 0.35. Explique pourquoi une entreprise pourrait choisir un autre seuil selon son budget de contact.
6. Modifie la probabilité de passage en dormance du générateur. Relance et explique ce que le PSI peut et ne peut pas révéler.
7. Essaie l'API avec une feature négative et avec un nombre de jours supérieur à 7. Observe les erreurs.

## Réponses à savoir expliquer

**Pourquoi SQL ?** Pour l'unicité, le rejeu et les agrégations auditables; SQLite garde la démo accessible. Une plateforme volumineuse demanderait d'autres choix.

**Pourquoi pas un LLM ?** La cible est une prédiction tabulaire; des modèles explicites fournissent des baselines utiles à moindre coût.

**Pourquoi pas un split aléatoire ?** Le modèle doit prédire des périodes futures. Mélanger les dates peut donner une évaluation trop optimiste.

**Pourquoi des clients communs entre périodes ?** On score une flotte connue. Pour un nouveau client, il faut un protocole distinct.

**Est-ce du churn ?** Ici, la cible est l'absence d'activité pendant 30 jours, pas une résiliation contractuelle.

**Est-ce un projet réalisé chez Orange ?** Non. Il est inspiré de l'expérience métier, mais construit séparément sur une simulation publique sans données de l'entreprise.

