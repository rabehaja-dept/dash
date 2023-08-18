import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export const vitestConfig = {
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // Apparently vite tries to resolve the package as `/contentful` first instead of `/node_modules/contentful
      // This forces it to look in node_modules instead
      contentful: "node_modules/contentful",
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    watchExclude: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
    deps: {
      inline: ["contentful"],
    },
  },
};

export default defineConfig(vitestConfig);
