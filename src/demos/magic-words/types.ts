import type { Texture } from "pixi.js";

export type Side = "left" | "right";
export type MagicToken = { type: "text"; value: string } | { type: "emoji"; name: string };
export type AvatarInfo = { texture?: Texture; side: Side };

export type MagicWordsData = {
    dialogue: { speaker: string; tokens: MagicToken[] }[];
    emojiTextures: Map<string, Texture>;
    avatars: Map<string, AvatarInfo>;
};
