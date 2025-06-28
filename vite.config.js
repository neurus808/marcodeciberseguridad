import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // Using a relative base path ensures the site works both on custom domains
  // and GitHub Pages previews where the project might be served from a
  // subdirectory. Without this, asset URLs like "/assets/..." could break in
  // some environments.
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ci: resolve(__dirname, 'ci-uruguay/index.html')
      }
    }
  }
});
