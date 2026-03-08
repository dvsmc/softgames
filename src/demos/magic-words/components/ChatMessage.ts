import { BitmapText, Container, Graphics, type Texture } from "pixi.js";
import {
    AVATAR_SIZE,
    AVATAR_TO_BUBBLE_GAP,
    BUBBLE_PADDING_X,
    BUBBLE_PADDING_Y,
    BUBBLE_TAIL_SIZE,
    SPEAKER_GAP,
    SPEAKER_LINE_HEIGHT,
    SPEAKER_STYLE,
} from "../consts";
import type { RichTextUtils } from "../richTextUtils";
import type { MagicToken, Side } from "../types";
import { Avatar } from "./Avatar";
import { RichText } from "./RichText";

const BUBBLE_FILL = { left: 0x202c33, right: 0x005c4b } as const;

const drawBubble = (g: Graphics, w: number, h: number, side: Side): void => {
    const fill = BUBBLE_FILL[side];
    const tailY = Math.min(AVATAR_SIZE * 0.5, h * 0.5);
    g.roundRect(0, 0, w, h, 10).fill(fill);
    if (side === "left") {
        g.poly([0, tailY - BUBBLE_TAIL_SIZE * 0.5, -BUBBLE_TAIL_SIZE, tailY, 0, tailY + BUBBLE_TAIL_SIZE * 0.5]).fill(
            fill,
        );
    } else {
        g.poly([
            w,
            tailY - BUBBLE_TAIL_SIZE * 0.5,
            w + BUBBLE_TAIL_SIZE,
            tailY,
            w,
            tailY + BUBBLE_TAIL_SIZE * 0.5,
        ]).fill(fill);
    }
};

export class ChatMessage extends Container {
    public readonly side: Side;
    public readonly speaker: string;
    public msgWidth = 0;
    public msgHeight = 0;

    private readonly avatar: Avatar;
    private readonly speakerLabel: BitmapText;
    private readonly richText: RichText;
    private readonly bg: Graphics;
    private readonly bubble: Container;

    public constructor(
        speaker: string,
        tokens: MagicToken[],
        emojis: Map<string, Texture>,
        avatarTexture: Texture | undefined,
        side: Side,
        availableWidth: number,
        utils: RichTextUtils,
    ) {
        super({ label: "chat-message" });
        this.side = side;
        this.speaker = speaker;

        this.avatar = new Avatar(speaker, avatarTexture);
        this.speakerLabel = new BitmapText({ text: speaker, style: SPEAKER_STYLE[side] });
        this.richText = new RichText(tokens, emojis, utils);
        this.bg = new Graphics();
        this.bubble = new Container({ label: "bubble" });
        this.bubble.addChild(this.bg, this.speakerLabel, this.richText);

        if (side === "left") {
            this.addChild(this.avatar, this.bubble);
        } else {
            this.addChild(this.bubble, this.avatar);
        }

        this.layout(availableWidth);
    }

    public layout(availableWidth: number): void {
        const maxBubbleW = Math.max(180, availableWidth - AVATAR_SIZE - AVATAR_TO_BUBBLE_GAP - BUBBLE_TAIL_SIZE - 8);
        const contentMaxW = Math.max(90, maxBubbleW - BUBBLE_PADDING_X * 2);

        this.richText.layout(contentMaxW);

        const bubbleW = Math.max(this.speakerLabel.width, this.richText.contentWidth) + BUBBLE_PADDING_X * 2;
        const bubbleH =
            BUBBLE_PADDING_Y + SPEAKER_LINE_HEIGHT + SPEAKER_GAP + this.richText.contentHeight + BUBBLE_PADDING_Y;
        const rowH = Math.max(AVATAR_SIZE, bubbleH);
        const bubbleX = AVATAR_SIZE + AVATAR_TO_BUBBLE_GAP + BUBBLE_TAIL_SIZE;
        const totalW = bubbleX + bubbleW;

        this.speakerLabel.position.set(BUBBLE_PADDING_X, BUBBLE_PADDING_Y);
        this.richText.position.set(BUBBLE_PADDING_X, BUBBLE_PADDING_Y + SPEAKER_LINE_HEIGHT + SPEAKER_GAP);

        this.bg.clear();
        drawBubble(this.bg, bubbleW, bubbleH, this.side);

        this.avatar.y = rowH - AVATAR_SIZE;

        if (this.side === "left") {
            this.bubble.x = bubbleX;
        } else {
            this.avatar.x = totalW - AVATAR_SIZE;
            this.bubble.x = 0;
        }

        this.msgWidth = totalW;
        this.msgHeight = rowH;
    }

    public updateEmojiTexture(name: string, texture: Texture): void {
        this.richText.updateEmojiTexture(name, texture);
    }

    public updateAvatar(texture: Texture): void {
        this.avatar.setTexture(texture);
    }
}
