/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  // Static file mode: set VITE_STATIC=true to build for file:// opening
  const isStatic = env.VITE_STATIC === 'true';
  return {
    base: isStatic ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
      // Single-file mode: inline ALL JS/CSS into index.html (works with file://)
      ...(isStatic ? [viteSingleFile()] : [VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
        },
        manifest: {
          name: 'Engineering Mastery',
          short_name: 'EngMastery',
          theme_color: '#FF6B35',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        }
      })]),
    ],
    define: {
      // GEMINI_API_KEY must NEVER be exposed to client.
      // For Gemini calls, add a backend proxy (Cloud Function / Edge Function).
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Single-file build: no chunking, inline everything
      ...(isStatic ? {
        assetsInlineLimit: 100_000_000,
        cssCodeSplit: false,
      } : {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'motion': ['motion'],
              'router': ['wouter'],
              'katex': ['katex', 'rehype-katex', 'remark-math'],
              'charts': ['recharts', 'chart.js', 'react-chartjs-2'],
              'pdf': ['jspdf', 'html2canvas'],
              'markdown': ['react-markdown'],
            }
          }
        }
      }),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  };
});
