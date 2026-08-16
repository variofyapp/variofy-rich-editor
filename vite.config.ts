import path from "node:path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**"],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "styles",
    },
    rollupOptions: {
      external: (id) =>
        id === "react" ||
        id === "react-dom" ||
        id === "react/jsx-runtime" ||
        id.startsWith("@tiptap/") ||
        id.startsWith("@radix-ui/") ||
        id === "lucide-react" ||
        id === "class-variance-authority" ||
        id === "clsx" ||
        id === "tailwind-merge",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
