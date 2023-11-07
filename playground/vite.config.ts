import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteConsoleDebug from 'vite-console-debug/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      ViteConsoleDebug({
        noConsole: mode === 'production',
      }),
      react(),
    ],
  };
});
