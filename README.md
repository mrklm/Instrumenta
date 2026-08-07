<p align="center">
  <img src="assets/instrumenta.png" alt="Instrumenta" width="360">
</p>

# Instrumenta

Instrumenta est une application pédagogique musicale en TypeScript dédiée à l'apprentissage instrumental. La première version se concentre sur la basse : lecture d'exercices, visualisation du manche, tablature synchronisée et repérage précis des cases à jouer. À terme, l'application a vocation à s'ouvrir à d'autres instruments, comme la guitare, le piano, la batterie et le scratch.

> **Statut du projet : application en phase de développement.**
>
> Instrumenta évolue rapidement. Les fonctionnalités, l'interface, les sons, les exercices et les calibrages visuels peuvent encore changer avant une version considérée comme stable.

## Objectif

Le but d'Instrumenta est d'aider les musiciennes et musiciens à relier trois informations essentielles :

- la note à jouer sur l'instrument ;
- sa position exacte sur le manche ;
- sa lecture dans une tablature simple.

L'application cherche à rendre l'apprentissage plus visuel, plus progressif et plus concret, en particulier pour les débutants qui construisent encore leurs repères sur l'instrument.

## Fonctionnalités Actuelles

- Affichage d'un manche de basse à partir de photos réelles.
- Modes droitier et gaucher.
- Surbrillance de la case à jouer sur la corde concernée.
- Affichage du numéro de frette en grand au-dessus du manche.
- Gestion des cordes à vide avec un repère visuel distinct.
- Tablature synchronisée avec la lecture.
- Navigation entre plusieurs exercices, dont un exercice de calibration couvrant toutes les cordes et les frettes 0 à 12.
- Lecture, pause, boucle et raccourci clavier `Espace`.
- Sélection de thèmes visuels.
- Sélection de teinte de main.
- Plusieurs presets de sons de basse avec contrôles de timbre.

## Ambitions

Instrumenta a vocation à devenir un outil pédagogique plus complet, capable d'accompagner progressivement le travail musical :

- enrichir la bibliothèque d'exercices ;
- ajouter des modules pour d'autres instruments ;
- améliorer la précision visuelle des placements ;
- proposer des parcours d'apprentissage ;
- intégrer des exercices de rythme, de lecture et de mémorisation ;
- améliorer les sons et les réglages instrumentaux ;
- rendre l'interface plus accessible et confortable sur différents écrans.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

## Vérifications

```bash
npm run test
npm run build
```

## Version

Version actuelle : `1.6.0`

Les évolutions sont listées dans [CHANGELOG.md](CHANGELOG.md).
