import { defineConfig } from "vite";
import { preact } from "@preact/preset-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "",
    server: {
        port: 4000,
        strictPort: true,
        host: true,
    },
    plugins: [preact(), tsconfigPaths()],
});
