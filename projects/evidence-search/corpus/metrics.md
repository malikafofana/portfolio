# Évaluation de classification

## Classes déséquilibrées
L'accuracy peut masquer l'échec sur une classe rare. Pour un problème multiclasse, examiner le F1 macro et le rappel de chaque classe. Pour un scoring binaire, comparer la PR-AUC au taux de positifs et mesurer précision et rappel au seuil retenu.

## Choix du seuil
Le seuil de décision se choisit sur la validation, selon un objectif explicite comme le F1. Le jeu de test doit rester réservé à l'évaluation finale. Le score de Brier mesure l'erreur des probabilités mais ne constitue pas à lui seul une preuve de calibration.
