# Ingestion de données

## Rejouer un import CSV
Chaque événement possède un event_id unique. Une nouvelle ingestion du même fichier ignore les doublons identiques. Un event_id déjà connu avec un contenu différent part en quarantaine. Ne pas écraser silencieusement un événement historique. Le hash SHA256 identifie le fichier source dans le rapport de qualité.

## Quarantaine
Les lignes avec date invalide, identifiant vide, valeur négative ou non finie sont rejetées. Le rapport conserve le numéro de ligne et la raison. Après correction, les lignes valides peuvent être réimportées.
