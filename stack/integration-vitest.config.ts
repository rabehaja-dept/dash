import { defineConfig } from "vite";
import { vitestConfig } from "./vitest.config";

// Use all the same config as our unit tests, but change which files we include
vitestConfig.test.include = [
  "./test/integration/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
];

export default defineConfig(vitestConfig);
