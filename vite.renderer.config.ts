import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: './', // ✅ THIS FIXES YOUR CORS + file:// PROBLEMS
  plugins: [
    vue(),
    VueDevTools(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
    }),
    viteStaticCopy({
      targets: [{ src: '_redirects', dest: '.' }],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
