import { defineConfig } from "vitest/config";
import { preact } from "@preact/preset-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [preact(), tsconfigPaths()],
    test: {
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        globals: true,
        typecheck: {
            tsconfig: "./tsconfig.test.json",
        },
    },
});
