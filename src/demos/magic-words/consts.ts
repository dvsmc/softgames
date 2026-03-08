import { FONT_FAMILY, FONT_SIZE } from "../../consts";
import type { Side } from "./types";

const BASE_STYLE = { fill: 0xe9edef, fontFamily: FONT_FAMILY, fontSize: FONT_SIZE } as const;

export const TITLE_STYLE = BASE_STYLE;
export const SUBTITLE_STYLE = { ...BASE_STYLE, fill: 0x8696a0 } as const;
export const BUBBLE_TEXT_STYLE = { ...BASE_STYLE, lineHeight: 28 } as const;

export const SPEAKER_STYLE: Record<Side, { fill: number; fontFamily: string; fontSize: number; lineHeight: number }> = {
    left: { ...BUBBLE_TEXT_STYLE, fill: 0x53bdeb },
    right: { ...BUBBLE_TEXT_STYLE, fill: 0x06cf9c },
};

export const SPEAKER_LINE_HEIGHT = 18;
export const AVATAR_SIZE = 64;
export const AVATAR_INNER_PADDING = 4;
export const BUBBLE_PADDING_X = 14;
export const BUBBLE_PADDING_Y = 10;
export const SPEAKER_GAP = 4;
export const ROW_GAP = 4;
export const AVATAR_TO_BUBBLE_GAP = 10;
export const BUBBLE_TAIL_SIZE = 10;
export const EMOJI_SIZE = 24;
export const TEXT_LINE_HEIGHT = 32;
export const TEXT_LINE_GAP = 3;
