import { BitmapText, Container, type DestroyOptions, Graphics, type Texture } from "pixi.js";
import type { DemoScene, ViewportSize } from "../../types";
import { fetchMagicWordsRaw, streamMagicWordsTextures } from "./api";
import { Background } from "./components/Background";
import { ChatScroller } from "./components/ChatScroller";
import { SUBTITLE_STYLE, TITLE_STYLE } from "./consts";
import { createRichTextUtils } from "./richTextUtils";
import type { AvatarInfo } from "./types";

export class MagicWords extends Container implements DemoScene {
    public readonly id = "magic-words" as const;

    private readonly background: Background;
    private readonly panel: Graphics;
    private readonly title: BitmapText;
    private readonly subtitle: BitmapText;
    private readonly scroller: ChatScroller;

    private viewport: ViewportSize = { width: 0, height: 0 };

    public constructor() {
        super({ label: "magic-words" });

        this.background = new Background();
        this.panel = new Graphics({ label: "panel" });
        this.title = new BitmapText({ text: "Magic Words", style: TITLE_STYLE });
        this.subtitle = new BitmapText({ text: "Loading...", style: SUBTITLE_STYLE });
        this.scroller = new ChatScroller(createRichTextUtils());

        this.addChild(this.background, this.panel, this.title, this.subtitle, this.scroller, this.scroller.chatMask);

        void this.load();
    }

    public get container(): Container {
        return this;
    }

    private async load(): Promise<void> {
        try {
            const raw = await fetchMagicWordsRaw();
            if (this.destroyed) {
                return;
            }

            const emojiTextures = new Map<string, Texture>();
            const avatars = new Map<string, AvatarInfo>(raw.avatarEntries.map((a) => [a.name, { side: a.position }]));

            this.subtitle.text = `${raw.dialogue.length} lines, loading assets...`;
            this.scroller.setData({ dialogue: raw.dialogue, emojiTextures: emojiTextures, avatars: avatars });
            this.layout();

            await streamMagicWordsTextures(
                raw,
                (name, texture) => {
                    if (this.destroyed) {
                        return;
                    }
                    emojiTextures.set(name, texture);
                    this.scroller.updateEmojiTexture(name, texture);
                },
                (name, texture) => {
                    if (this.destroyed) {
                        return;
                    }
                    const info = avatars.get(name);
                    if (info) {
                        info.texture = texture;
                    }
                    this.scroller.updateAvatarTexture(name, texture);
                },
            );

            if (!this.destroyed) {
                this.subtitle.text = `${raw.dialogue.length} lines, ${emojiTextures.size} emojis, ${raw.avatarEntries.length} avatars`;
            }
        } catch {
            if (this.destroyed) {
                return;
            }
            this.subtitle.text = "Failed to load";
        }
    }

    private layout(): void {
        const { width: vw, height: vh } = this.viewport;
        if (!vw || !vh) {
            return;
        }

        const mx = Math.max(14, vw * 0.05);
        const my = Math.max(14, vh * 0.04);
        const fw = vw - mx * 2;
        const fh = vh - my * 2;

        const HEADER_PAD = 14;
        const headerH = HEADER_PAD * 2 + this.title.height + this.subtitle.height + 2;

        this.panel
            .clear()
            .roundRect(mx, my, fw, fh, 16)
            .fill(0x111b21)
            .roundRect(mx, my, fw, headerH, 16)
            .fill(0x1f2c34)
            .rect(mx, my + headerH - 16, fw, 16)
            .fill(0x1f2c34);

        this.title.position.set(mx + 20, my + HEADER_PAD);
        this.subtitle.position.set(mx + 20, this.title.y + this.title.height + 2);

        const chatX = mx + 16;
        const chatY = this.subtitle.y + this.subtitle.height + 12;
        const chatW = Math.max(120, fw - 32);
        const chatH = Math.max(80, my + fh - chatY - 14);

        this.scroller.resize(chatX, chatY, chatW, chatH);
    }

    public resize(viewport: ViewportSize): void {
        this.viewport = viewport;
        this.background.resize(viewport);
        this.layout();
    }

    public update(deltaMs: number): void {
        this.scroller.update(deltaMs);
    }

    public override destroy(options?: DestroyOptions): void {
        this.scroller.destroy();
        super.destroy(options);
    }
}
