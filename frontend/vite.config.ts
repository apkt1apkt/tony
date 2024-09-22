import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9000", // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: Remove `/api` prefix if needed
      },
    },
  },
});
