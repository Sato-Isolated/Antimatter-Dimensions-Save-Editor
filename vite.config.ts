/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Antimatter-Dimensions-Save-Editor/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('@codemirror') || id.includes('@uiw/react-codemirror')) {
            return 'vendor-codemirror';
          }

          if (
            id.includes('@fortawesome')
            || id.includes('font-awesome')
            || id.includes('react-icons')
          ) {
            return 'vendor-icons';
          }

          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }

          if (id.includes('pako')) {
            return 'vendor-pako';
          }

          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
}); 