// Simple util to avoid TypeScript complaining about Object.keys returning string[] instead of (keyof T)[]
export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
