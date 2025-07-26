import { defineConfig } from 'vite'
import { resolve } from 'path'
import { builtinModules } from 'node:module' // Import builtinModules directly for ESM compatibility
console.log('--- vite.main.config.ts is being loaded ---')
// https://vitejs.dev/config/
export default defineConfig({
  // This build configuration is specifically for the Electron Main Process.
  build: {
    // The output directory for the compiled main process code.
    // Electron Forge's Vite plugin will handle moving this to the correct location in the final package.
    outDir: resolve(__dirname, '.vite/main'),
    // Clear the output directory before building.
    emptyOutDir: true,
    // Minify the output code if in production mode.
    minify: process.env.NODE_ENV === 'production',
    // Configure as a library build, as Electron processes are essentially Node.js libraries.
    lib: {
      // Entry point for your main Electron process TypeScript file.
      entry: resolve(__dirname, 'electron/main.ts'), // Ensure this path is correct
      // 👉 FINAL CRITICAL FIX: Set the output file name to 'index'
      // This will make Vite output 'index.js' or 'index.cjs'
      fileName: 'index',
      // Output format: CommonJS is standard for Node.js/Electron main process.
      formats: ['cjs'],
    },
    // Rollup options for fine-grained control over the bundling process.
    rollupOptions: {
      // Externalize Electron and Node.js built-in modules.
      // This prevents Vite from trying to bundle them, as they are available in the Electron environment.
      external: [
        'electron',
        // Use the imported builtinModules array
        ...builtinModules,
      ],
    },
  },
  // Resolve aliases for easier imports within your main process code.
  resolve: {
    alias: {
      // Example: Allows you to use `@/` to refer to your 'src' directory.
      '@': resolve(__dirname, 'src'),
    },
  },
})
