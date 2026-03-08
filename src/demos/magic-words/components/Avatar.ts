import { BitmapText, Container, Graphics, Sprite, type Texture } from "pixi.js";
import { AVATAR_INNER_PADDING, AVATAR_SIZE, TITLE_STYLE } from "../consts";

const FRAME_RADIUS = 16;

const initials = (name: string): string =>
    name
        .split(/\s+/u)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

export class Avatar extends Container {
    private content: Container;

    public constructor(speaker: string, texture?: Texture) {
        super({ label: "avatar" });

        const inner = AVATAR_SIZE - AVATAR_INNER_PADDING * 2;

        const frame = new Graphics()
            .roundRect(0, 0, AVATAR_SIZE, AVATAR_SIZE, FRAME_RADIUS)
            .fill(0x2a3942)
            .roundRect(0, 0, AVATAR_SIZE, AVATAR_SIZE, FRAME_RADIUS)
            .stroke({ color: 0x3b4a54, width: 2 });

        this.content = texture
            ? new Sprite({
                  texture: texture,
                  x: AVATAR_INNER_PADDING,
                  y: AVATAR_INNER_PADDING,
                  width: inner,
                  height: inner,
              })
            : new BitmapText({
                  text: initials(speaker),
                  style: TITLE_STYLE,
                  anchor: 0.5,
                  x: AVATAR_SIZE * 0.5,
                  y: AVATAR_SIZE * 0.5,
              });

        this.addChild(frame, this.content);
    }

    public setTexture(texture: Texture): void {
        const inner = AVATAR_SIZE - AVATAR_INNER_PADDING * 2;
        const sprite = new Sprite({
            texture: texture,
            x: AVATAR_INNER_PADDING,
            y: AVATAR_INNER_PADDING,
            width: inner,
            height: inner,
        });
        this.content.destroy();
        this.content = sprite;
        this.addChild(sprite);
    }
}
