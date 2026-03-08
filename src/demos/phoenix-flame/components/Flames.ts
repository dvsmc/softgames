import { Particle, ParticleContainer, type Spritesheet } from "pixi.js";
import type { ViewportSize } from "../../../types";
import { getKeys } from "../../../utils/getKeys";
import { randomFloat } from "../../../utils/math";
import {
    FLAME_BASE_SCALE,
    FLAME_INTENSITY,
    FLAME_LIFE_SPEED,
    FLAME_PARTICLES_COUNT,
    FLAME_WOBBLE_AMP,
    FLAME_WOBBLE_FREQ,
} from "../consts";

type FlameData = {
    particle: Particle;
    phase: number;
    life: number;
    lifeSpeed: number;
    baseScale: number;
    wobbleFreq: number;
    wobbleAmp: number;
};

export class Flames extends ParticleContainer {
    private readonly flameData: FlameData[] = [];
    private emitterX: number = 0;
    private emitterY: number = 0;
    private time: number = 0;
    private columnHeight: number = 0;

    public constructor(flames: Spritesheet) {
        super({
            label: "flames",
            dynamicProperties: {
                position: true,
                vertex: true,
                rotation: true,
                color: true,
            },
            blendMode: "add",
        });

        const frameNames = getKeys(flames.data.frames);
        for (let i = 0; i < FLAME_PARTICLES_COUNT; ++i) {
            const particle = new Particle({
                texture: flames.textures[frameNames[i % frameNames.length]],
                anchorX: 0.5,
                anchorY: 1,
            });
            this.addParticle(particle);
            this.flameData.push({
                particle: particle,
                phase: (i / FLAME_PARTICLES_COUNT) * Math.PI * 2 + randomFloat(0, 0.5),
                life: i / FLAME_PARTICLES_COUNT,
                lifeSpeed: randomFloat(...FLAME_LIFE_SPEED),
                baseScale: randomFloat(...FLAME_BASE_SCALE),
                wobbleFreq: randomFloat(...FLAME_WOBBLE_FREQ),
                wobbleAmp: randomFloat(...FLAME_WOBBLE_AMP),
            });
        }
    }

    public updateFlames(deltaMs: number): void {
        const deltaSec = deltaMs / 1000;
        this.time += deltaSec;

        const columnHeight = this.columnHeight * 0.33 * FLAME_INTENSITY;

        for (const flame of this.flameData) {
            flame.life += flame.lifeSpeed * deltaSec * (0.8 + FLAME_INTENSITY * 0.4);

            if (flame.life >= 1) {
                this.resetFlame(flame);
            }

            const sway =
                Math.sin(this.time * flame.wobbleFreq + flame.phase) * flame.wobbleAmp * FLAME_INTENSITY +
                Math.sin(this.time * flame.wobbleFreq * 2.3 + flame.phase * 1.7) *
                    flame.wobbleAmp *
                    0.3 *
                    FLAME_INTENSITY;

            flame.particle.x = this.emitterX + sway;
            flame.particle.y = this.emitterY - flame.life * columnHeight;

            const scaleBase = flame.baseScale * (0.8 + FLAME_INTENSITY * 0.35);
            flame.particle.scaleX = scaleBase * (1 - flame.life * 0.55);
            flame.particle.scaleY = scaleBase * (0.9 + flame.life * 0.15);

            flame.particle.tint = colorRamp(flame.life);

            const envelope = flame.life < 0.15 ? flame.life / 0.15 : 1 - ((flame.life - 0.15) / 0.85) ** 1.6;

            const flicker =
                0.78 +
                Math.sin(this.time * 8.3 + flame.phase) * 0.12 +
                Math.sin(this.time * 17.1 + flame.phase * 2.1) * 0.06;

            flame.particle.alpha = Math.max(0, envelope) * flicker;
            flame.particle.rotation = sway * 0.001;
        }
    }

    public resize({ width, height }: ViewportSize): void {
        this.emitterX = width * 0.5;
        this.emitterY = height * 0.95;
        this.columnHeight = height;
    }

    private resetFlame(flame: FlameData): void {
        flame.life = 0;
        flame.lifeSpeed = randomFloat(...FLAME_LIFE_SPEED);
        flame.baseScale = randomFloat(...FLAME_BASE_SCALE);
        flame.wobbleFreq = randomFloat(...FLAME_WOBBLE_FREQ);
        flame.wobbleAmp = randomFloat(...FLAME_WOBBLE_AMP);
    }
}

function colorRamp(life: number): number {
    if (life < 0.12) {
        return 0xcc1100;
    }
    if (life < 0.28) {
        return 0xff4400;
    }
    if (life < 0.5) {
        return 0xff9900;
    }
    if (life < 0.7) {
        return 0xffee88;
    }
    return 0xffffff;
}
