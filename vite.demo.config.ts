import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Keep generated asset URLs relative so the demo works under a
  // GitHub Pages project path as well as on a custom domain.
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "site-dist",
    emptyOutDir: true,
  },
});
