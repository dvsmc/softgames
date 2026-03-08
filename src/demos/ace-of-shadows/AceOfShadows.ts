import { gsap } from "gsap";
import type { DestroyOptions, Spritesheet } from "pixi.js";
import { Container } from "pixi.js";
import type { DemoScene, ViewportSize } from "../../types";
import { getKeys } from "../../utils/getKeys";
import { randomFloat } from "../../utils/math";
import { Background } from "./components/Background";
import { Card } from "./components/Card";
import { StackGuide } from "./components/StackGuide";
import { BACK_FRAME, CARD_COUNT, MOVE_INTERVAL_MS, STACK_COUNT } from "./consts";

const cardZIndex = (stackIndex: number, depth: number) => stackIndex * CARD_COUNT + depth;

export class AceOfShadows extends Container implements DemoScene {
    public readonly id = "ace-of-shadows" as const;

    private readonly background: Background;
    private readonly stackGuide: StackGuide;
    private readonly cardsLayer: Container;
    private readonly stacks: Card[][];

    private startDeck = 0;
    private timer: gsap.core.Tween | null = null;

    public constructor({ cards }: { cards: Spritesheet }) {
        super({ label: "ace-of-shadows" });

        this.background = new Background();
        this.stackGuide = new StackGuide();
        this.cardsLayer = new Container({ label: "cards-layer", sortableChildren: true });
        this.stacks = Array.from({ length: STACK_COUNT }, () => []);

        this.addChild(this.background, this.stackGuide, this.cardsLayer);

        const backTexture = cards.textures[BACK_FRAME];
        const frameNames = getKeys(cards.data.frames).filter((frame) => frame !== BACK_FRAME);

        for (let i = 0; i < CARD_COUNT; i++) {
            const card = new Card(cards.textures[frameNames[i % frameNames.length]], backTexture);
            card.stackOffset.x = i > 0 ? randomFloat(-2, 2) : 0;
            card.stackOffset.y = i > 0 ? randomFloat(-0.3, 0.3) : 0;
            card.stackOffset.angle = i > 0 ? randomFloat(-10, 10) : 0;
            this.stacks[0].push(card);
            this.cardsLayer.addChild(card);
        }

        this.scheduleNext();
    }

    public get container(): Container {
        return this;
    }

    private placeCard(stackIndex: number, card: Card, depth: number): void {
        const { x, y, angle } = this.stackGuide.cardPosition(stackIndex, card.stackOffset, depth);
        card.x = x;
        card.y = y;
        card.angle = angle;
        card.zIndex = cardZIndex(stackIndex, depth);
    }

    private layoutStack(idx: number): void {
        const stack = this.stacks[idx];
        for (let i = 0, len = stack.length; i < len; i++) {
            this.placeCard(idx, stack[i], i);
        }
    }

    private destinationDeck(): number {
        return (this.startDeck + 1) % STACK_COUNT;
    }

    private moveNextCard(): void {
        const startStack = this.stacks[this.startDeck];

        if (!startStack.length) {
            this.startDeck = this.destinationDeck();
            this.scheduleNext();
            return;
        }

        const destinationIndex = this.destinationDeck();
        const destinationStack = this.stacks[destinationIndex];
        const card = startStack.pop();
        if (!card) {
            return;
        }

        this.layoutStack(this.startDeck);

        const destinationDepth = destinationStack.length;
        const { x, y, angle } = this.stackGuide.cardPosition(destinationIndex, card.stackOffset, destinationDepth);

        card.zIndex = cardZIndex(this.stacks.length + 1, CARD_COUNT + 1); // on top of all cards during movement
        card.moveTo(x, y, angle, () => {
            destinationStack.push(card);
            card.zIndex = cardZIndex(destinationIndex, destinationDepth);
            this.scheduleNext();
        });
    }

    private scheduleNext(): void {
        if (this.destroyed) {
            return;
        }
        this.timer = gsap.delayedCall(MOVE_INTERVAL_MS / 1000, () => this.moveNextCard());
    }

    public resize(viewport: ViewportSize): void {
        this.background.resize(viewport);
        this.stackGuide.resize(viewport);

        for (let i = 0; i < STACK_COUNT; i++) {
            this.layoutStack(i);
        }
    }

    public update(_deltaMs: number): void {
        // nothing to update, currently only gsap is updating animations
    }

    public override destroy(options?: DestroyOptions): void {
        this.timer?.kill();
        this.timer = null;
        for (const stack of this.stacks) {
            stack.length = 0;
        }
        super.destroy(options);
    }
}
