import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * The site is served from the root of its own domain, so assets are requested
 * from `/assets/...`. A GitHub Pages project site under
 * `user.github.io/<repo>/` needs the repo name instead — build it with
 * VITE_BASE_PATH=/<repo>/ rather than editing this file.
 */
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
});
