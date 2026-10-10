# Variables et temporalité

## Éviter la fuite temporelle
Pour prédire l'inactivité sur les 30 prochains jours, les features doivent utiliser exclusivement les événements strictement antérieurs au cutoff. Les labels utilisent une fenêtre future distincte. Le modèle ne reçoit ni identifiant client ni variable calculée après la date de prédiction.

## Couverture des observations
L'absence d'événements ne prouve pas l'inactivité si la collecte est incomplète. Un watermark de couverture doit atteindre la fin de la fenêtre future avant de créer les labels. Une panne de collecte doit produire un statut inconnu, pas un label inactif.
