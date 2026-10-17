import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)))

  if (command === 'serve' && !env.VITE_DEV_PROXY_TARGET) {
    throw new Error('VITE_DEV_PROXY_TARGET est absent : copier .env.example en .env et le renseigner.')
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // En développement, les appels `/api` sont relayés vers le backend local.
      proxy: {
        '/api': env.VITE_DEV_PROXY_TARGET,
      },
    },
  }
})
