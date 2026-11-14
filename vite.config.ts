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
      '@': resolve(import.meta.dirname, './src')
    }
  },
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-icons', test: /node_modules[\\/]react-icons[\\/]/, priority: 20 },
            { name: 'vendor-react', test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/, priority: 10 },
            { name: 'vendor-pako', test: /node_modules[\\/]pako[\\/]/, priority: 10 },
            { name: 'vendor', test: /node_modules/, priority: 0 },
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
}); 
