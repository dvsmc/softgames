import { Sprite, type Texture } from "pixi.js";
import type { ViewportSize } from "../../../types";

export class Background extends Sprite {
    public constructor(texture: Texture) {
        super({
            label: "background",
            texture: texture,
            anchor: { x: 0.5, y: 0.5 },
        });
    }

    public resize({ width, height }: ViewportSize): void {
        // Scale the background to cover the entire viewport while maintaining aspect ratio and fitting the viewport bounds, like css background cover
        const scale = Math.max(width / this.texture.width, height / this.texture.height);
        this.scale.set(scale);
        this.x = width / 2;
        this.y = height / 2;
    }
}
