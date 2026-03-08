import type { Container, DestroyOptions } from "pixi.js";

import type { DEMOS } from "./consts";

export type ViewportSize = { width: number; height: number };

export type DemoId = keyof typeof DEMOS;

export type DemoScene = {
    readonly id: DemoId;
    readonly container: Container;
    resize(viewport: ViewportSize): void;
    update(deltaMs: number): void;
    destroy(options?: DestroyOptions): void;
};
