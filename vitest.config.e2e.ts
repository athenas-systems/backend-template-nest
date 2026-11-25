import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

const testEnv = loadEnv("test", process.cwd(), "");
const testDatabaseUrl =
  testEnv.TEST_DATABASE_URL ?? process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  throw new Error(
    "Set TEST_DATABASE_URL in .env.test before running e2e tests.",
  );
}
process.env.DATABASE_URL = testDatabaseUrl;

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [swc.vite()],
  test: {
    globals: true,
    root: "./",
    include: ["test/**/*.e2e-spec.ts"],
    globalSetup: ["./test/global-setup.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
