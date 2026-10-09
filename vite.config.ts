import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// VITE_BASE lets CI deploy under a sub-path (GitHub Pages: /<repo>/).
// Default './' keeps built assets relative so the build works anywhere.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react(), tailwindcss()],
});
