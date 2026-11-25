import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [swc.vite()],
  test: {
    globals: true,
    root: "./",
    include: ["**/*.spec.ts"],
  },
});
