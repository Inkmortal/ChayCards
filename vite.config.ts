import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist/main',
            minify: false,
            sourcemap: true,
            rollupOptions: {
              external: ['electron']
            }
          },
        },
        onstart(options) {
          options.reload();
        },
      },
      {
        // Preload scripts
        entry: 'src/preload/index.ts',
        vite: {
          build: {
            outDir: 'dist/preload',
            minify: false,
            sourcemap: true,
          },
        },
        onstart(options) {
          options.reload();
        },
      },
    ]),
  ],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@main': resolve(__dirname, 'src/main'),
      '@preload': resolve(__dirname, 'src/preload'),
      '@plugins': resolve(__dirname, 'plugins'),
      '@components': resolve(__dirname, 'src/renderer/components'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  clearScreen: false,
});
