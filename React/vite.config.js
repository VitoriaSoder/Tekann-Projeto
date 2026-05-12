import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      webp: {
        quality: 80,
      },
      avif: {
        quality: 70,
      },
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupIds: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
})
