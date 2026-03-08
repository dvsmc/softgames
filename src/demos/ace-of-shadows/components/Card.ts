import { gsap } from "gsap";
import { Container, type DestroyOptions, Sprite, type Texture } from "pixi.js";
import { ARC_HEIGHT, CARD_FLIP_DURATION_MS, CARD_HEIGHT, CARD_WIDTH, MOVE_DURATION_MS } from "../consts";

export class Card extends Container {
    private readonly front: Sprite;
    private readonly back: Sprite;
    private flipTimer: gsap.core.Tween | null = null;

    public readonly stackOffset = { x: 0, y: 0, angle: 0 };

    public constructor(frontTexture: Texture, backTexture: Texture) {
        super({ label: "card" });
        this.front = new Sprite({
            label: "front",
            texture: frontTexture,
            anchor: { x: 0.5, y: 0.5 },
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
        });
        this.back = new Sprite({
            label: "back",
            texture: backTexture,
            anchor: { x: 0.5, y: 0.5 },
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
        });
        this.front.visible = false;
        this.addChild(this.front, this.back);
    }

    private get isFaceDown(): boolean {
        return this.back.visible;
    }

    public moveTo(x: number, y: number, angle: number, onComplete: () => void): void {
        const duration = MOVE_DURATION_MS / 1000;
        const midY = Math.min(this.y, y) - ARC_HEIGHT;

        gsap.killTweensOf(this);

        gsap.to(this, { x: x, angle: angle, duration: duration, ease: "power1.inOut" });
        gsap.to(this, {
            keyframes: [
                { y: midY, duration: duration * 0.5, ease: "power1.out" },
                { y: y, duration: duration * 0.5, ease: "power1.in" },
            ],
            onComplete: () => {
                if (this.destroyed) {
                    return;
                }
                onComplete();
            },
        });

        this.flipTimer = gsap.delayedCall(duration * 0.5 - CARD_FLIP_DURATION_MS / 1000, () => {
            this.flipTimer = null;
            void this.flip();
        });
    }

    private flip(): Promise<void> {
        if (this.destroyed) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            gsap.to(this, {
                pixi: { scaleX: 0 },
                duration: CARD_FLIP_DURATION_MS / 1000,
                ease: "power1.in",
                onComplete: () => {
                    if (this.destroyed) {
                        return;
                    }
                    const toFront = this.isFaceDown;
                    this.front.visible = toFront;
                    this.back.visible = !toFront;
                    gsap.to(this, {
                        pixi: { scaleX: 1 },
                        duration: CARD_FLIP_DURATION_MS / 1000,
                        ease: "power1.out",
                        onComplete: resolve,
                    });
                },
            });
        });
    }

    public override destroy(options?: DestroyOptions): void {
        gsap.killTweensOf(this);
        this.flipTimer?.kill();
        this.flipTimer = null;
        super.destroy(options);
    }
}
