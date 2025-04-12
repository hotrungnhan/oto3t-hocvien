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
  base: '/oto3t-hocvien/', // Set to your repo name
})
