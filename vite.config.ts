import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split rarely-changing libraries so returning guests hit the browser cache.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['motion'],
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
