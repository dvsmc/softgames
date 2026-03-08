import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Application, Assets, BitmapText, Container, Sprite } from "pixi.js";
import { FONT_FAMILY, FONT_SIZE, MAIN_MANIFEST } from "./consts";
import { createAceOfShadows } from "./demos/ace-of-shadows/createAceOfShadows";
import { createMagicWords } from "./demos/magic-words/createMagicWords";
import { createPhoenixFlame } from "./demos/phoenix-flame/createPhoenixFlame";
import type { DemoId, DemoScene } from "./types";
import { createUi } from "./ui/Ui";
import { debounce } from "./utils/debounce";

const DEMO_SCENE_CREATORS = {
    "ace-of-shadows": createAceOfShadows,
    "magic-words": createMagicWords,
    "phoenix-flame": createPhoenixFlame,
} as const satisfies Record<DemoId, () => DemoScene | Promise<DemoScene>>;

const main = async (): Promise<void> => {
    const appEle = document.querySelector<HTMLCanvasElement>("#app");
    const uiEle = document.querySelector<HTMLElement>("#ui");
    if (!appEle || !uiEle) {
        throw new Error("Required elements (#app and #ui) not found!");
    }

    // Register gsap animation lib to Pixi
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI({
        Container: Container,
        Sprite: Sprite,
    });

    // Create Pixi.js app
    const app = new Application();
    await app.init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        resizeTo: window,
        canvas: appEle,
        resolution: window.devicePixelRatio || 1,
    });
    app.stage.sortableChildren = true;

    // Load main assets
    for (const bundle of MAIN_MANIFEST.bundles) {
        Assets.addBundle(bundle.name, bundle.assets);
    }
    await Assets.loadBundle(MAIN_MANIFEST.bundles.map((bundle) => bundle.name));

    // Add fps counter
    const fpsText = new BitmapText({
        label: "fps",
        text: "FPS --",
        style: {
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
        },
        x: 8,
        y: 8,
        zIndex: 99999,
    });
    app.stage.addChild(fpsText);

    let activeScene: DemoScene | null = null;

    // Run Pixi ticker
    app.ticker.add(() => {
        activeScene?.update(app.ticker.deltaMS);
        fpsText.text = `FPS: ${Math.round(app.ticker.FPS)}`;
    });

    // Mostly UI and scene switching handling
    const onResize = debounce((): void => {
        activeScene?.resize({ width: app.screen.width, height: app.screen.height });
    }, 50);
    const clearActiveScene = (): void => {
        if (!activeScene) {
            return;
        }
        app.stage.removeChild(activeScene.container);
        activeScene.destroy({ children: true });
        activeScene = null;
    };
    const onSelectDemo = async (id: DemoId): Promise<void> => {
        if (activeScene?.id === id) {
            return;
        }
        clearActiveScene();
        const scene = await DEMO_SCENE_CREATORS[id]();
        activeScene = scene;
        activeScene.container.zIndex = 0;
        app.stage.addChild(activeScene.container);
        onResize();
    };

    const onBack = (): void => {
        clearActiveScene();
    };

    // Create React UI
    const destroyUi = createUi(uiEle, onSelectDemo, onBack);

    const cleanup = (): void => {
        clearActiveScene();
        app.destroy(true, { children: true, texture: false });
        destroyUi();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("beforeunload", cleanup);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("beforeunload", cleanup);
};

void main();
