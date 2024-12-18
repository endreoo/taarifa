import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5170,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5170',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
