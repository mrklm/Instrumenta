# Changelog

Toutes les évolutions notables d'Instrumenta sont listées ici.

## [1.2.0] - 2026-08-04

### Ajouté
- Boutons main gauche/main droite autour du titre pour changer rapidement d'orientation.
- Sélection de teinte des mains dans le menu avec aperçu visuel.

## [1.1.0] - 2026-08-04

### Ajouté
- Photos réelles de manches de basse pour les modes droitier et gaucher.
- Import des images de manche via Vite depuis le dossier `assets`.
- Positions de surbrillance recalibrées pour se placer sur les cordes et frettes des photos.

### Modifié
- Remplacement du manche dessiné en SVG par une photo réelle avec overlays pédagogiques.
- Suppression des frettes, cordes et repères synthétiques superposés pour laisser la photo lisible.

## [1.0.0] - 2026-08-04

### Ajouté
- Prototype React, Vite et TypeScript strict pour l'apprentissage de la basse.
- Manche de basse SVG 4 cordes avec frettes 0 à 12, repères et surbrillance des notes actives.
- Tablature SVG générée depuis les événements musicaux.
- Moteur de lecture basé sur `performance.now()` et `requestAnimationFrame`.
- Contrôles de transport : lecture, pause, recommencer, tempo, boucle et son.
- Mode droitier/gaucher avec calcul explicite des positions du manche.
- Menu de réglages avec thème, orientation et instrument.
- Thèmes de couleur personnalisés.
- Navigation entre quatre exercices de basse.
- Synthé Web Audio simple avec dix presets, trois potentiomètres et preset "Contrebasse feutrée".
- Tests unitaires pour la timeline, la boucle et l'orientation.
