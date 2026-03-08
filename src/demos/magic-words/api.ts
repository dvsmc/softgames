import { Assets, type Texture } from "pixi.js";
import type { MagicToken, Side } from "./types";

const API_ENDPOINT = "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";
const MAX_LOAD_TIMEOUT_MS = 6_000;

type ApiResponse = {
    dialogue: { name: string; text: string }[];
    emojies: { name: string; url: string }[];
    avatars: { name: string; url: string; position: "left" | "right" }[];
};

export type MagicWordsRaw = {
    dialogue: { speaker: string; tokens: MagicToken[] }[];
    emojiEntries: { name: string; url: string }[];
    avatarEntries: { name: string; url: string; position: Side }[];
};

const TOKEN_PATTERN = /\{([^}]+)\}/g;

const parseTokens = (text: string): MagicToken[] => {
    const tokens: MagicToken[] = [];
    let cursor = 0;
    for (const match of text.matchAll(TOKEN_PATTERN)) {
        const marker = match[0];
        const name = match[1]?.trim();
        const idx = match.index ?? cursor;
        if (idx > cursor) {
            tokens.push({ type: "text", value: text.slice(cursor, idx) });
        }
        tokens.push(name ? { type: "emoji", name: name } : { type: "text", value: marker });
        cursor = idx + marker.length;
    }
    if (cursor < text.length) {
        tokens.push({ type: "text", value: text.slice(cursor) });
    }
    return tokens;
};

const loadTexture = (url: string): Promise<Texture | null> => {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), MAX_LOAD_TIMEOUT_MS));
    const load = Assets.load<Texture>({ src: url, parser: "loadTextures" }).catch(() => null);
    return Promise.race([load, timeout]);
};

export const fetchMagicWordsRaw = async (): Promise<MagicWordsRaw> => {
    const res = await fetch(API_ENDPOINT);
    if (!res.ok) {
        throw new Error(`Magic Words fetch failed (${res.status})`);
    }
    // oxlint-disable-next-line no-unsafe-type-assertion -- we should use Zod to validate API responses
    const payload = (await res.json()) as ApiResponse;
    return {
        dialogue: payload.dialogue.map((l) => ({ speaker: l.name, tokens: parseTokens(l.text) })),
        emojiEntries: payload.emojies,
        avatarEntries: payload.avatars,
    };
};

export const streamMagicWordsTextures = async (
    raw: MagicWordsRaw,
    onEmoji: (name: string, texture: Texture) => void,
    onAvatar: (name: string, texture: Texture) => void,
): Promise<void> => {
    await Promise.all([
        ...raw.emojiEntries.map(async ({ name, url }) => {
            const t = await loadTexture(url);
            if (t) {
                onEmoji(name, t);
            }
        }),
        ...raw.avatarEntries.map(async ({ name, url }) => {
            const t = await loadTexture(url);
            if (t) {
                onAvatar(name, t);
            }
        }),
    ]);
};
