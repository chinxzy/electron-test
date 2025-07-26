import { defineConfig } from 'vite'
import { resolve } from 'path'
// 👉 Import builtinModules directly for ESM compatibility
import { builtinModules } from 'node:module'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: resolve(__dirname, '.vite/preload'),
    emptyOutDir: true,
    minify: process.env.NODE_ENV === 'production',
    lib: {
      entry: resolve(__dirname, 'electron/preload.ts'), // Ensure this path is correct
      fileName: 'preload',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        // 👉 Use the imported builtinModules array
        ...builtinModules,
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
