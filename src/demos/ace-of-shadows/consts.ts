import type { AssetsManifest } from "pixi.js";
import cardsJsonUrl from "/assets/cards.json?url";

export const CARD_COUNT = 144;
export const STACK_COUNT = 3;
export const MOVE_INTERVAL_MS = 1000;
export const MOVE_DURATION_MS = 2000;
export const BACK_FRAME = "cardBack_blue4";
export const ARC_HEIGHT = 120;
export const CARD_WIDTH = 96;
export const CARD_HEIGHT = 136;
export const CARD_STACK_OFFSET = 0.9;
export const STACK_BORDER_COLOR = 0xffff00;
export const CARD_FLIP_DURATION_MS = 150;

export const ACE_OF_SHADOWS_MANIFEST = {
    bundles: [
        {
            name: "ace-of-shadows",
            assets: [
                {
                    alias: "cards",
                    src: cardsJsonUrl,
                },
            ],
        },
    ],
} as const satisfies AssetsManifest;
