import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo: https://github.com/milanomality/-wedding_day → Pages URL has '/-wedding_day/' subpath.
export default defineConfig({
  base: '/-wedding_day/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
