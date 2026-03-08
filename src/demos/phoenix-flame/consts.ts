import type { AssetsManifest } from "pixi.js";
import backgroundUrl from "/assets/background.webp?url";
import flamesJsonUrl from "/assets/flames.json?url";

export const FLAME_PARTICLES_COUNT = 10;
export const FLAME_INTENSITY = 1.1;
export const FLAME_LIFE_SPEED = [0.25, 0.55] as const;
export const FLAME_BASE_SCALE = [0.8, 1.6] as const;
export const FLAME_WOBBLE_FREQ = [1.4, 2.8] as const;
export const FLAME_WOBBLE_AMP = [16, 34] as const;

export const PHOENIX_FLAME_MANIFEST = {
    bundles: [
        {
            name: "phoenix-flame",
            assets: [
                {
                    alias: "background",
                    src: backgroundUrl,
                },
                {
                    alias: "flames",
                    src: flamesJsonUrl,
                },
            ],
        },
    ],
} as const satisfies AssetsManifest;
