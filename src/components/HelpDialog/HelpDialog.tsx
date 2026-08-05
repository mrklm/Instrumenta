import "./HelpDialog.css";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  if (!isOpen) {
    return null;
  }

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
          <h2 id="help-title">Aide basse</h2>
          <button type="button" className="helpClose" onClick={onClose}>
            Fermer
          </button>
        </header>

        <div className="helpContent">
          <p>
            Instrumenta affiche un exercice de basse sous deux formes
            synchronisées : le manche photographié et la tablature.
          </p>
          <p>
            Le rectangle bleu indique la case à appuyer sur la corde concernée.
            Le rectangle blanc indique une corde à vide : il faut jouer la corde
            sans poser de doigt sur le manche.
          </p>
          <p>
            Le grand numéro au-dessus du manche rappelle la frette demandée. Les
            boutons fléchés permettent de changer d'exercice.
          </p>
          <p>
            À gauche, le potar règle le tempo. Les boutons Lecture et Stop
            contrôlent l'exercice ; la barre Espace déclenche aussi Lecture ou
            Stop. À droite, les potars règlent le son de basse et les effets.
          </p>
          <p>
            Les mains autour du titre permettent de basculer rapidement entre
            mode gaucher et mode droitier.
          </p>
        </div>
      </section>
    </div>
  );
}
