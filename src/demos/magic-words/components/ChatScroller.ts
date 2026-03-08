import { gsap } from "gsap";
import { Container, type DestroyOptions, Graphics, type Texture } from "pixi.js";
import { ROW_GAP } from "../consts";
import type { RichTextUtils } from "../richTextUtils";
import type { MagicWordsData } from "../types";
import { ChatMessage } from "./ChatMessage";

export class ChatScroller extends Container {
    public readonly chatMask = new Graphics({ label: "chat-mask" });

    private readonly list = new Container({ label: "list" });
    private readonly messages: ChatMessage[] = [];
    private chatWidth = 0;
    private chatHeight = 0;
    private contentHeight = 0;
    private scrollOffset = 0;
    private targetOffset = 0;

    public constructor(private readonly utils: RichTextUtils) {
        super({ label: "chat-scroller" });
        this.mask = this.chatMask;
        this.addChild(this.list);
        window.addEventListener("wheel", this.onWheel, { passive: true });
    }

    private readonly onWheel = (e: WheelEvent): void => {
        const travel = Math.max(0, this.contentHeight - this.chatHeight);
        this.targetOffset = Math.min(travel, Math.max(0, this.targetOffset + e.deltaY));
    };

    public setData(data: MagicWordsData): void {
        for (const child of this.list.removeChildren()) {
            gsap.killTweensOf(child);
            child.destroy({ children: true });
        }
        this.messages.length = 0;
        this.scrollOffset = 0;
        this.targetOffset = 0;

        for (const [i, line] of data.dialogue.entries()) {
            const avatar = data.avatars.get(line.speaker);
            const side = avatar?.side ?? "left";
            const msg = new ChatMessage(
                line.speaker,
                line.tokens,
                data.emojiTextures,
                avatar?.texture,
                side,
                this.chatWidth,
                this.utils,
            );
            msg.alpha = 0;
            gsap.to(msg, { alpha: 1, delay: i * 0.06, duration: 0.35, ease: "power2.out" });
            this.messages.push(msg);
            this.list.addChild(msg);
        }
    }

    public resize(x: number, y: number, width: number, height: number): void {
        const widthChanged = width !== this.chatWidth;
        this.chatWidth = width;
        this.chatHeight = height;
        this.position.set(x, y);
        this.chatMask.position.set(x, y);
        this.chatMask.clear().rect(0, 0, width, height).fill(0xffffff);

        if (widthChanged) {
            for (const msg of this.messages) {
                msg.layout(width);
            }
        }

        this.positionMessages();
    }

    private positionMessages(): void {
        let cursorY = 0;
        for (const msg of this.messages) {
            msg.position.set(msg.side === "right" ? this.chatWidth - msg.msgWidth : 0, cursorY);
            cursorY += msg.msgHeight + ROW_GAP;
        }
        this.contentHeight = Math.max(0, cursorY - ROW_GAP);
        const travel = Math.max(0, this.contentHeight - this.chatHeight);
        this.targetOffset = Math.min(travel, this.targetOffset);
        this.scrollOffset = Math.min(travel, this.scrollOffset);
        this.list.y = -this.scrollOffset;
    }

    public update(deltaMs: number): void {
        if (this.contentHeight <= this.chatHeight) {
            this.list.y = 0;
            return;
        }
        const factor = 1 - Math.exp((-8 * deltaMs) / 1000);
        this.scrollOffset += (this.targetOffset - this.scrollOffset) * factor;
        this.list.y = -this.scrollOffset;
    }

    public updateEmojiTexture(name: string, texture: Texture): void {
        for (const msg of this.messages) {
            msg.updateEmojiTexture(name, texture);
        }
    }

    public updateAvatarTexture(speaker: string, texture: Texture): void {
        for (const msg of this.messages) {
            if (msg.speaker === speaker) {
                msg.updateAvatar(texture);
            }
        }
    }

    public override destroy(options?: DestroyOptions): void {
        window.removeEventListener("wheel", this.onWheel);
        super.destroy(options);
    }
}
