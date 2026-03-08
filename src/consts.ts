import type { AssetsManifest } from "pixi.js";
import CleanPlateXmlUrl from "/assets/CleanPlate.xml?url";

export const FONT_FAMILY = "CleanPlate";
export const FONT_SIZE = 13;

export const DEMOS = {
    "ace-of-shadows": "Ace of Shadows",
    "magic-words": "Magic Words",
    "phoenix-flame": "Phoenix Flame",
} as const;

export const MAIN_MANIFEST = {
    bundles: [
        {
            name: "main",
            assets: [
                {
                    alias: "CleanPlate",
                    src: CleanPlateXmlUrl,
                },
            ],
        },
    ],
} as const satisfies AssetsManifest;
