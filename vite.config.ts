import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    host: false,
    port: 3000,
    open: true,
    proxy: {},
  },
  build: {
    outDir: './build',
    sourcemap: true,
    // sourcemap: false
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
