import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import constants from '@/assets/constants/constants'
const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    Vuetify(),
    vueDevTools(),
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
      optionsSuccessStatus: 204,
    },
    proxy: {
      '/api': {
        target: env.VITE_LOCAL_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  base: './',
})
