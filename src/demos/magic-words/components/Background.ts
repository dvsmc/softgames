import { Graphics } from "pixi.js";
import type { ViewportSize } from "../../../types";

export class Background extends Graphics {
    public constructor() {
        super({ label: "background" });
    }

    public resize({ width, height }: ViewportSize): void {
        this.clear().rect(0, 0, width, height).fill(0x0b141a);
    }
}
