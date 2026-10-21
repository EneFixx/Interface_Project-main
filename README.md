# Projet d'interface : Ma Cinémathèque

Projet réalisé lors du cours d'Interface Development and Design à l'efrei.
Il s'agit d'un site web construite avec vue.js qui permet de rechercher des films et de les ajouter à une bibliothèque personnelle.

## Lien Figma
https://www.figma.com/design/vkzWoWKULUHt3v2M7Ymw2O/Project_Interface?node-id=0-1&t=LK9hPyEnzIcc2eso-1

## Personas
Eli Copter
- Grand consommateur de cinéma
- N'arrive pas à tenir correctement un agenda de ce qu'il a regardé
- Chercher un moyen de référencer ce qu'il a vu

Aude Javel
- Regarde des films une à deux fois par mois
- N'arrive pas à trouvver une basee de données claire de film pour l'aider à faire un choix
- Cherche un site qui référence tous les sites

## API utilisée

**OMDb API** : récupération d'information sur les films (titre, année, synopsys, code IMDb, etc).

## Fonctionnalités

- Connexion à un compte personnel
- Recherche de films par titre ou identifiant IMDb
- Filtrage par année
- Tri des résultats par titre ou année
- Ajout/retrait d'un film à une bibliothèque personnelle
- Marquer un film comme favori/non favori ou lu/non lu
- Mode sombre/clair
- Persistance via localStorage

## Installation

(prérequis : node.js et npm)

### Dépendances
```bash
npm install
```

### Lancer le serveur
```bash
npm run dev
```



## Contributeurs :

Armand LABERNARDIERE
Raphaël LAURENT