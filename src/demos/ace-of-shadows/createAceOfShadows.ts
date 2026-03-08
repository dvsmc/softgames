import { Assets, type Spritesheet } from "pixi.js";

import type { DemoScene } from "../../types";
import { AceOfShadows } from "./AceOfShadows";
import { ACE_OF_SHADOWS_MANIFEST } from "./consts";

export const createAceOfShadows = async (): Promise<DemoScene> => {
    // Load assets
    for (const bundle of ACE_OF_SHADOWS_MANIFEST.bundles) {
        Assets.addBundle(bundle.name, bundle.assets);
    }
    const result = await Assets.loadBundle(ACE_OF_SHADOWS_MANIFEST.bundles.map((bundle) => bundle.name));
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- We should create pixi loaded asset type
    const cards = result["ace-of-shadows"].cards as Spritesheet;
    // Create main scene
    return new AceOfShadows({ cards: cards });
};
