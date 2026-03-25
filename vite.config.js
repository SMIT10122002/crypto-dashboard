import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.VITE_COINGECKO_DEMO_API_KEY?.trim();

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/coingecko": {
          target: "https://api.coingecko.com/api/v3",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/coingecko/, ""),
          headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
        },
      },
    },
  };
});
