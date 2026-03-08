import { BitmapText, Texture } from "pixi.js";
import { BUBBLE_TEXT_STYLE, EMOJI_SIZE } from "./consts";
import type { MagicToken } from "./types";

type StyleConfig = typeof BUBBLE_TEXT_STYLE;
type TextAtom = { type: "text"; kind: "word" | "space"; value: string; width: number; style: StyleConfig };
type EmojiAtom = { type: "emoji"; name: string; texture: Texture; width: number };
export type Atom = TextAtom | EmojiAtom;
type WrapState = { rows: Atom[][]; lw: number };

export type RichTextUtils = {
    tokensToAtoms: (tokens: MagicToken[], emojis: Map<string, Texture>) => Atom[];
    wrapAtoms: (atoms: Atom[], maxWidth: number) => Atom[][];
};

const isSpace = (a: Atom): a is TextAtom & { kind: "space" } => a.type === "text" && a.kind === "space";

const isLongWord = (a: Atom, maxWidth: number): a is TextAtom =>
    a.type === "text" && a.kind === "word" && a.width > maxWidth && a.value.length > 1;

const trimSpaces = (row: Atom[]): void => {
    while (row.length > 0 && isSpace(row[row.length - 1])) {
        row.pop();
    }
};

const placeAtom = (state: WrapState, atom: Atom, maxWidth: number): void => {
    const cur = state.rows[state.rows.length - 1];
    if (isSpace(atom)) {
        if (cur.length && state.lw + atom.width <= maxWidth) {
            cur.push(atom);
            state.lw += atom.width;
        }
        return;
    }
    if (state.lw > 0 && state.lw + atom.width > maxWidth) {
        trimSpaces(cur);
        state.rows.push([]);
        state.lw = 0;
    }
    state.rows[state.rows.length - 1].push(atom);
    state.lw += atom.width;
};

export const createRichTextUtils = (): RichTextUtils => {
    const measureCache = new Map<string, number>();
    let probeBase: BitmapText | null = null;

    const getProbe = (style: StyleConfig): BitmapText => {
        probeBase ??= new BitmapText({ text: "", style: style });
        return probeBase;
    };

    const measureRaw = (value: string, style: StyleConfig): number => {
        const probe = getProbe(style);
        probe.text = value;
        return probe.width;
    };

    const measureWidth = (value: string, style: StyleConfig): number => {
        const key = value;
        const cached = measureCache.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const width = /^\s+$/u.test(value)
            ? Math.max(1, measureRaw(`a${value}a`, style) - measureRaw("aa", style))
            : measureRaw(value, style);
        measureCache.set(key, width);
        return width;
    };

    const textAtom = (value: string, style: StyleConfig): TextAtom => ({
        type: "text",
        kind: /^\s+$/u.test(value) ? "space" : "word",
        value: value,
        width: measureWidth(value, style),
        style: style,
    });

    const breakWord = (atom: TextAtom, maxWidth: number): TextAtom[] => {
        const parts: TextAtom[] = [];
        let chunk = "";
        for (const char of atom.value) {
            const next = chunk + char;
            if (chunk && measureWidth(next, atom.style) > maxWidth) {
                parts.push({ ...atom, value: chunk, width: measureWidth(chunk, atom.style) });
                chunk = char;
            } else {
                chunk = next;
            }
        }
        if (chunk) {
            parts.push({ ...atom, value: chunk, width: measureWidth(chunk, atom.style) });
        }
        return parts;
    };

    const tokenToAtoms = (token: MagicToken, emojis: Map<string, Texture>): Atom[] => {
        if (token.type !== "emoji") {
            return token.value
                .split(/(\s+)/u)
                .filter(Boolean)
                .map((part) => textAtom(part, BUBBLE_TEXT_STYLE));
        }
        return [
            { type: "emoji", name: token.name, texture: emojis.get(token.name) ?? Texture.EMPTY, width: EMOJI_SIZE },
        ];
    };

    const tokensToAtoms = (tokens: MagicToken[], emojis: Map<string, Texture>): Atom[] =>
        tokens.flatMap((token) => tokenToAtoms(token, emojis));

    const wrapAtoms = (atoms: Atom[], maxWidth: number): Atom[][] => {
        if (!atoms.length) {
            return [];
        }
        const state: WrapState = { rows: [[]], lw: 0 };
        for (const atom of atoms) {
            if (isLongWord(atom, maxWidth)) {
                for (const chunk of breakWord(atom, maxWidth)) {
                    placeAtom(state, chunk, maxWidth);
                }
            } else {
                placeAtom(state, atom, maxWidth);
            }
        }
        for (const row of state.rows) {
            trimSpaces(row);
        }
        return state.rows.filter((r) => r.length > 0);
    };

    return { tokensToAtoms: tokensToAtoms, wrapAtoms: wrapAtoms };
};
