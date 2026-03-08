import { Graphics } from "pixi.js";

import type { ViewportSize } from "../../../types";

export class Background extends Graphics {
    public constructor() {
        super({ label: "background" });
    }

    public resize({ width, height }: ViewportSize): void {
        const cx = width / 2;
        const cy = height / 2;
        const rx = width * 0.46;
        const ry = height * 0.42;
        const railThickness = Math.min(width, height) * 0.045;

        this.clear()
            // Dark room background
            .rect(0, 0, width, height)
            .fill(0x1a0f07)
            // Wood rail (outer oval)
            .ellipse(cx, cy, rx + railThickness, ry + railThickness)
            .fill(0x6b3a1f)
            // Rail highlight ring
            .ellipse(cx, cy, rx + railThickness * 0.7, ry + railThickness * 0.7)
            .fill(0x8b4e28)
            // Felt base (green)
            .ellipse(cx, cy, rx, ry)
            .fill(0x1a6b35)
            // Felt inner shading for depth
            .ellipse(cx, cy, rx * 0.85, ry * 0.85)
            .fill(0x1f7a3d)
            // Center highlight
            .ellipse(cx, cy * 0.9, rx * 0.4, ry * 0.3)
            .fill({ color: 0x24913f, alpha: 0.4 });
    }
}
