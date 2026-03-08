import { Container } from "pixi.js";
import type { DemoScene, ViewportSize } from "../../types";
import { Background } from "./components/Background";
import { Flames } from "./components/Flames";
import type { PhoenixFlameAssets } from "./types";

export class PhoenixFlame extends Container implements DemoScene {
    public readonly id = "phoenix-flame" as const;

    private readonly background: Background;
    private readonly flames: Flames;

    public constructor(assets: PhoenixFlameAssets) {
        super({ label: "phoenix-flame" });

        this.background = new Background(assets.background);
        this.flames = new Flames(assets.flames);
        this.addChild(this.background, this.flames);
    }

    public get container(): Container {
        return this;
    }

    public resize(viewport: ViewportSize): void {
        this.background.resize(viewport);
        this.flames.resize(viewport);
    }

    public update(deltaMs: number): void {
        this.flames.updateFlames(deltaMs);
    }
}
