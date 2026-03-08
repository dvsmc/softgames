export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

export function easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function randomInt(min: number, max: number): number {
    const floorMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - floorMin + 1)) + floorMin;
}

export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
