# Changelog

Toutes les évolutions notables d'Instrumenta sont listées ici.

## [1.6.0] - 2026-08-07

### Ajouté
- Intégration des 20 exercices débutants depuis le fichier JSON pédagogique.
- Affichage des indications pédagogiques dans une barre défilante réglable.

### Modifié
- Conservation des silences musicaux via `lengthBeats` dans la lecture et la tablature.
- Réglage interactif de la vitesse de défilement des indications.

## [1.5.1] - 2026-08-05

### Modifié
- Réorganisation des contrôles avec tempo et transport en colonne à gauche.
- Simplification des mains affichées autour du titre.
- Amélioration de la chaîne audio et des effets `Disto`, `Delay` et `Reverb`.
- Raccourci `Espace` dédié à l'action lecture/stop.

## [1.5.0] - 2026-08-05

### Ajouté
- Exercice 5 de vérification couvrant toutes les cordes et les frettes 0 à 12.

### Modifié
- Calibration des rectangles de notes à partir des images de manche annotées.
- Rectangles de notes affinés pour mieux cibler l'intersection corde/case.

## [1.4.0] - 2026-08-04

### Ajouté
- Raccourci clavier `Espace` pour lecture/pause.

### Modifié
- Changement d'exercice plus fluide pendant la lecture, avec enchaînement immédiat du nouvel exercice.

## [1.3.0] - 2026-08-04

### Ajouté
- Images de mains autour du titre pour basculer entre mode droitier et mode gaucher.
- Sélection de teinte de main dans le menu.

### Modifié
- Ajustement précis des numéros de frettes, des notes actives et des labels `E A D G` sur les photos de manches droitier et gaucher.

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
