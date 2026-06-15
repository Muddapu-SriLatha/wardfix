import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // 1. Proxy /api requests to Express Node.js Backend API
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // 2. Proxy /ai requests to FastAPI Python Image Classification Microservice
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ai/, ''),
      },
      // 3. Proxy WebSocket connections to Socket.io server
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
      // 4. Proxy uploaded images static route
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
