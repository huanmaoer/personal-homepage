import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // GitHub Pages 部署：base 必须为 '/<仓库名>/'
  // 等你在 GitHub 建好仓库后，把下面这行的 personal-homepage 改成你的仓库名
  base: '/personal-homepage/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
