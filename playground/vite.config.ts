import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteConsoleDebug from '../src/vite';
import ReactInspector from 'vite-plugin-react-inspector';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      ViteConsoleDebug({
        noConsole: false,
        port: 5173,
      }),
      react(),
    ],
  };
});
