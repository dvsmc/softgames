import { BitmapText, Container, Graphics } from "pixi.js";
import { FONT_FAMILY, FONT_SIZE } from "../../../consts";
import type { ViewportSize } from "../../../types";
import { CARD_HEIGHT, CARD_STACK_OFFSET, CARD_WIDTH, STACK_BORDER_COLOR, STACK_COUNT } from "../consts";

type StackPosition = { x: number; y: number };

export class StackGuide extends Container {
    private readonly guides: Graphics[] = [];
    private readonly labels: BitmapText[] = [];
    private viewport: ViewportSize = { width: 0, height: 0 };

    public constructor() {
        super({ label: "stack-guides" });

        for (let i = 0; i < STACK_COUNT; i++) {
            const guide = new Graphics()
                .roundRect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, 8)
                .stroke({ color: STACK_BORDER_COLOR, width: 1, alpha: 0.6 });

            const label = new BitmapText({
                text: `Stack ${i + 1}`,
                style: { fontFamily: FONT_FAMILY, fontSize: FONT_SIZE },
            });
            label.anchor.set(0.5, 0);

            this.guides.push(guide);
            this.labels.push(label);
            this.addChild(guide, label);
        }
    }

    private stackX(stackIndex: number): number {
        const spacing = Math.min(220, this.viewport.width / (STACK_COUNT + 0.5));
        return this.viewport.width * 0.5 - (STACK_COUNT - 1) * spacing * 0.5 + spacing * stackIndex;
    }

    private stackBaseY(): number {
        return this.viewport.height * 0.33;
    }

    public cardPosition(
        stackIndex: number,
        offset: { x: number; y: number; angle: number },
        depth: number,
    ): StackPosition & { angle: number } {
        return {
            x: this.stackX(stackIndex) + depth * 0.08 + offset.x,
            y: this.stackBaseY() + depth * CARD_STACK_OFFSET + offset.y,
            angle: offset.angle,
        };
    }

    public resize(viewport: ViewportSize): void {
        this.viewport = viewport;

        for (let i = 0; i < STACK_COUNT; i++) {
            const x = this.stackX(i);
            const y = this.stackBaseY();

            this.guides[i].x = x;
            this.guides[i].y = y;
            this.labels[i].x = x;
            this.labels[i].y = y + CARD_HEIGHT * 0.6;
        }
    }
}
