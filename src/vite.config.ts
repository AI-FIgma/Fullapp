import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: ''
        },
        {
          src: 'public/sw.js',
          dest: ''
        },
        {
          src: 'public/icon.svg',
          dest: ''
        },
        {
          src: 'public/test.txt',
          dest: ''
        }
      ]
    })
  ],
  publicDir: false, // Disable default public dir to avoid conflicts
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});