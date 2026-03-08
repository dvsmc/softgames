import { BitmapText, Container, Sprite, type Texture } from "pixi.js";
import { EMOJI_SIZE, TEXT_LINE_GAP, TEXT_LINE_HEIGHT } from "../consts";
import type { RichTextUtils } from "../richTextUtils";
import type { MagicToken } from "../types";

export class RichText extends Container {
    public contentWidth = 0;
    public contentHeight = 0;

    private readonly tokens: MagicToken[];
    private readonly emojis: Map<string, Texture>;
    private readonly utils: RichTextUtils;
    private readonly emojiSprites = new Map<string, Sprite[]>();

    public constructor(tokens: MagicToken[], emojis: Map<string, Texture>, utils: RichTextUtils) {
        super();
        this.tokens = tokens;
        this.emojis = emojis;
        this.utils = utils;
    }

    public updateEmojiTexture(name: string, texture: Texture): void {
        this.emojiSprites.get(name)?.forEach((s) => {
            s.texture = texture;
        });
    }

    public layout(maxWidth: number): void {
        for (const child of this.removeChildren()) {
            child.destroy();
        }
        this.emojiSprites.clear();

        const atoms = this.utils.tokensToAtoms(this.tokens, this.emojis);
        const rows = this.utils.wrapAtoms(atoms, maxWidth);
        let cursorY = 0;
        let measuredWidth = 0;

        for (const row of rows) {
            let cursorX = 0;
            for (const atom of row) {
                if (atom.type === "emoji") {
                    const sprite = new Sprite({
                        texture: atom.texture,
                        x: cursorX,
                        y: cursorY + Math.max(0, Math.floor((TEXT_LINE_HEIGHT - EMOJI_SIZE) * 0.5)),
                        width: EMOJI_SIZE,
                        height: EMOJI_SIZE,
                    });
                    const list = this.emojiSprites.get(atom.name);
                    if (list) {
                        list.push(sprite);
                    } else {
                        this.emojiSprites.set(atom.name, [sprite]);
                    }
                    this.addChild(sprite);
                } else {
                    this.addChild(new BitmapText({ text: atom.value, style: atom.style, x: cursorX, y: cursorY }));
                }
                cursorX += atom.width;
            }
            measuredWidth = Math.max(measuredWidth, cursorX);
            cursorY += TEXT_LINE_HEIGHT + TEXT_LINE_GAP;
        }

        this.contentWidth = measuredWidth;
        this.contentHeight = rows.length > 0 ? cursorY - TEXT_LINE_GAP : 0;
    }
}
