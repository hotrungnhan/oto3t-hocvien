import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import dsv from '@rollup/plugin-dsv';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dsv()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/hoc-vien-oto-3t/', // Set to your repo name
})
