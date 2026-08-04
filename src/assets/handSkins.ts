import hand1Left from "../../assets/mains/main 1 G.png";
import hand1Right from "../../assets/mains/main 1 D.png";

export interface HandSkin {
  id: string;
  leftImage: string;
  rightImage: string;
}

export const HAND_SKINS = [
  {
    id: "main-1",
    leftImage: hand1Left,
    rightImage: hand1Right,
  },
] as const satisfies readonly HandSkin[];

export type HandSkinId = (typeof HAND_SKINS)[number]["id"];

export const DEFAULT_HAND_SKIN_ID: HandSkinId = "main-1";

export function getHandSkinById(handSkinId: HandSkinId): HandSkin {
  return HAND_SKINS.find((skin) => skin.id === handSkinId) ?? HAND_SKINS[0];
}
