import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const base = process.env.BASE_PATH || (isPagesBuild ? '/jpdesigner/' : '/');

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
});
