import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /**
         * React goes into its own chunk. Two reasons:
         *   1. it changes far less often than the site, so a content
         *      edit does not invalidate 140 kB of library in the cache;
         *   2. the public-truth tests read the app chunk, and React's
         *      own minified strings would otherwise trip them.
         */
        manualChunks(id: string) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});
