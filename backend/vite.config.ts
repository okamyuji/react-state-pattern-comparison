import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/db.ts",
      formats: ["es"],
      fileName: "db",
    },
    rollupOptions: {
      external: ["node:fs", "node:path", "node:url"],
    },
  },
  test: {
    globals: true,
  },
});
