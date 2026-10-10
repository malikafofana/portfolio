# Réponses traçables

## Provenance d'un extrait
Une citation comprend le nom du fichier, l'identifiant du passage et le hash SHA256 de son contenu. Elle permet de retrouver le texte effectivement utilisé. Un lien vers une source n'est pas une garantie que la réponse est correcte.

## Abstention
Le moteur doit s'abstenir lorsque le corpus ne fournit pas de passage assez proche. Le seuil se règle sur un jeu de développement distinct du test. La similarité cosinus est un signal de proximité lexicale, pas une probabilité de vérité.
