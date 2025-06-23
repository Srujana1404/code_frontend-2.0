import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { config } from 'dotenv';

config({ path: __dirname + '/.env' });
const { SERVER_IP } = process.env;


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 9058,
  },
  server: {
    host: true,
    port: 9058,
    proxy: {
      '/api': {
        target: `http://${SERVER_IP}:1314/`,
        changeOrigin: true,
        xfwd: true,
      },
    },
  },
});