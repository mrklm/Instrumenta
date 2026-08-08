import "./HelpDialog.css";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  if (!isOpen) {
    return null;
  }

  const sections = [
    {
      id: "demarrage",
      title: "Démarrer un exercice",
      steps: [
        "Choisissez un exercice dans la liste centrale, activez le son si besoin, puis lancez la lecture avec le bouton Lecture ou la barre Espace.",
        "Le manche, la tablature et la barre de consignes avancent ensemble pour montrer quoi jouer, où poser le doigt et quand le jouer.",
      ],
    },
    {
      id: "manche",
      title: "Lire le manche",
      steps: [
        "Le rectangle jaune indique une corde appuyée : il faut poser le doigt dans la case demandée, sur la corde indiquée.",
        "Le rectangle blanc transparent indique une corde à vide : il faut jouer la corde sans poser de doigt sur le manche.",
        "Le grand numéro au-dessus du manche rappelle la frette visée. Les lettres E/A/D/G sont aussi affichées avec leurs équivalents francophones dans les titres d'exercices.",
      ],
    },
    {
      id: "tablature",
      title: "Tablature",
      steps: [
        "La tablature en bas reprend le même exercice sous forme de lecture musicale simplifiée. Le curseur de lecture permet de suivre la note au bon moment.",
        "Les zéros correspondent aux cordes à vide. Les autres chiffres correspondent aux cases à jouer.",
      ],
    },
    {
      id: "exercices",
      title: "Choisir les exercices",
      steps: [
        "La liste d'exercices est organisée par niveaux : Débutant, Intermédiaires et Avancé.",
        "Les exercices débutants servent à parcourir le manche, mémoriser les cordes et travailler les écarts simples. Les niveaux suivants ajoutent des déplacements, tonalités, enchaînements et réflexes plus avancés.",
        "Les grandes flèches permettent de passer rapidement à l'exercice précédent ou suivant.",
      ],
    },
    {
      id: "consignes",
      title: "Utiliser les consignes",
      steps: [
        "La barre défilante entre le manche et la tablature donne l'objectif, le conseil de jeu, l'écoute à viser et le critère de réussite.",
        "Au chargement d'un exercice, le début de la consigne reste visible quelques secondes. Ensuite, le texte défile en boucle.",
        "Un clic sur cette barre met le défilement en pause et ouvre le réglage de vitesse.",
      ],
    },
    {
      id: "lecture",
      title: "Contrôler la lecture",
      steps: [
        "Le module de gauche regroupe le tempo, Lecture, Stop, Boucle et Son.",
        "La barre Espace déclenche Lecture ou Stop, quel que soit le bouton utilisé juste avant.",
        "Le potentiomètre de tempo règle la vitesse de l'exercice. Un double-clic le remet au tempo prévu pour l'exercice.",
      ],
    },
    {
      id: "metronome",
      title: "Métronome",
      steps: [
        "Le métronome peut être activé indépendamment du son de basse. Il suit le tempo de l'exercice.",
        "Le volume et le timbre du clic sont réglables. Le premier temps de chaque mesure est accentué pour aider à sentir le cycle.",
      ],
    },
    {
      id: "orientation",
      title: "Droitier / gaucher",
      steps: [
        "Les mains situées de part et d'autre du titre Instrumenta changent l'orientation du manche.",
        "Cliquez sur la main gauche pour passer en mode gaucher, ou sur la main droite pour revenir en mode droitier.",
        "En mode gaucher, les indications pédagogiques qui mentionnent main gauche ou main droite sont adaptées automatiquement.",
      ],
    },
    {
      id: "son",
      title: "Régler le son de basse",
      steps: [
        "Les modules de droite permettent de choisir un preset de basse et de régler Volume, Tonalité, Drive, Disto, Delay et Reverb.",
        "Les valeurs des potentiomètres apparaissent pendant leur manipulation. Un double-clic remet chaque potentiomètre à sa valeur d'origine.",
        "Volume à 0% coupe réellement le son de basse.",
      ],
    },
  ];

  return (
    <div className="helpOverlay" role="presentation" onMouseDown={onClose}>
      <section
        className="helpDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="helpHeader">
          <div>
            <h2 id="help-title">Guide d'utilisation basse</h2>
            <p>Aide détaillée, point par point, pour comprendre chaque zone de l'application.</p>
          </div>
          <button type="button" className="helpClose" onClick={onClose}>
            Fermer
          </button>
        </header>

        <div className="helpContent" tabIndex={0} aria-label="Contenu de l'aide, zone défilante">
          <p className="helpIntro">
            Faites défiler cette fenêtre avec la molette, le trackpad ou le
            curseur vertical à droite pour parcourir toute l'aide.
          </p>

          {sections.map((section, sectionIndex) => (
            <section key={section.id} id={`help-${section.id}`}>
              <h3>
                <span>{sectionIndex + 1}</span>
                {section.title}
              </h3>
              <ol>
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
