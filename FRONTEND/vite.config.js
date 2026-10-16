import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    // En desarrollo siempre '/'. En producción usa la variable VITE_BASE
    // (solo GitHub Pages la define como '/TEXTICODE/'); si no existe, '/'.
    base: isDev ? '/' : (process.env.VITE_BASE || '/'),
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: 'localhost',
      port: 5173,
      https: isDev && fs.existsSync('./certs/localhost.key')
        ? {
            key: fs.readFileSync('./certs/localhost.key'),
            cert: fs.readFileSync('./certs/localhost.crt')
          }
        : undefined,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  }
})
