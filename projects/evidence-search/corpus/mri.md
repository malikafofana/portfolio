# Expérimentation IRM

## Découpage par patient
Des coupes issues du même patient peuvent être corrélées. Un découpage aléatoire par image ne démontre pas l'indépendance du test. Avec des identifiants patients, utiliser un split par groupe et vérifier l'absence d'intersection entre train, validation et test.

## Explicabilité
Grad-CAM montre des régions contribuant à une prédiction. Cette visualisation ne prouve pas que le modèle reconnaît une structure médicalement pertinente. Une validation experte et une cohorte externe sont nécessaires pour une interprétation clinique.
