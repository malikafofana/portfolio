# Sécurité d'une application IA

## Instructions dans les documents
Le contenu récupéré est une donnée, jamais une instruction système. Un passage demandant de révéler des secrets doit être traité comme du texte non fiable. Un moteur extractif peut afficher cette phrase comme citation mais ne doit exécuter aucune action.

## Démonstration locale
Le serveur de démonstration écoute uniquement sur 127.0.0.1. Il n'a ni authentification ni limitation de débit et n'est pas destiné à une exposition Internet. Le chargement de modèles provenant de fichiers pickle non fiables peut exécuter du code; préférer un format contrôlé.
