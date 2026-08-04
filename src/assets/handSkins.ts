import hand1Left from "../../assets/mains/main 1 G.png";
import hand1Right from "../../assets/mains/main 1 D.png";
import hand2Left from "../../assets/mains/mains 2 G.png";
import hand2Right from "../../assets/mains/mains 2 D.png";
import hand3Left from "../../assets/mains/mains 3 G.png";
import hand3Right from "../../assets/mains/mains 3 D.png";
import hand4Left from "../../assets/mains/mains 4 G.png";
import hand4Right from "../../assets/mains/mains 4 D.png";

export interface HandSkin {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftImage: string;
  rightImage: string;
}

export const HAND_SKINS = [
  {
    id: "main-1",
    label: "Teinte de main 1",
    leftLabel: "main 1 G.png",
    rightLabel: "main 1 D.png",
    leftImage: hand1Left,
    rightImage: hand1Right,
  },
  {
    id: "mains-2",
    label: "Teinte de main 2",
    leftLabel: "mains 2 G.png",
    rightLabel: "mains 2 D.png",
    leftImage: hand2Left,
    rightImage: hand2Right,
  },
  {
    id: "mains-3",
    label: "Teinte de main 3",
    leftLabel: "mains 3 G.png",
    rightLabel: "mains 3 D.png",
    leftImage: hand3Left,
    rightImage: hand3Right,
  },
  {
    id: "mains-4",
    label: "Teinte de main 4",
    leftLabel: "mains 4 G.png",
    rightLabel: "mains 4 D.png",
    leftImage: hand4Left,
    rightImage: hand4Right,
  },
] as const satisfies readonly HandSkin[];

export type HandSkinId = (typeof HAND_SKINS)[number]["id"];

export const DEFAULT_HAND_SKIN_ID: HandSkinId = "main-1";

export function getHandSkinById(handSkinId: HandSkinId): HandSkin {
  return HAND_SKINS.find((skin) => skin.id === handSkinId) ?? HAND_SKINS[0];
}
