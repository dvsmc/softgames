import { Assets } from "pixi.js";

import type { DemoScene } from "../../types";
import { PHOENIX_FLAME_MANIFEST } from "./consts";
import { PhoenixFlame } from "./PhoenixFlame";
import type { PhoenixFlameAssets } from "./types";

export const createPhoenixFlame = async (): Promise<DemoScene> => {
    // Load assets
    for (const bundle of PHOENIX_FLAME_MANIFEST.bundles) {
        Assets.addBundle(bundle.name, bundle.assets);
    }
    const result = await Assets.loadBundle(PHOENIX_FLAME_MANIFEST.bundles.map((bundle) => bundle.name));
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- We should create pixi loaded asset type
    const assets = result["phoenix-flame"] as PhoenixFlameAssets;
    // Create main scene
    return new PhoenixFlame(assets);
};
