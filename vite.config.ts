import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5170,
    host: true,
    proxy: {
      '/api/ezee': {
        target: 'https://live.ipms247.com',
        changeOrigin: true,
        rewrite: (path) => '/pmsinterface/getdataAPI.php',
        secure: false,
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        }
      }
    }
  }
});
