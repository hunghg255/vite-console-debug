import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteConsoleDebug from '../src/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      ViteConsoleDebug({
        noConsole: mode === 'production',
        disableLaunchEditor: mode === 'production',
      }),
      react(),
    ],
  };
});
