var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// vite.main.config.ts
import { defineConfig } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\LENOVO\\Documents\\work\\Oditor\\oditorwebpos";
var vite_main_config_default = defineConfig({
  // This build configuration is specifically for the Electron Main Process.
  build: {
    // The output directory for the compiled main process code.
    // Electron Forge's Vite plugin will handle moving this to the correct location in the final package.
    outDir: resolve(__vite_injected_original_dirname, ".vite/main"),
    // Clear the output directory before building.
    emptyOutDir: true,
    // Minify the output code if in production mode.
    minify: process.env.NODE_ENV === "production",
    // Configure as a library build, as Electron processes are essentially Node.js libraries.
    lib: {
      // Entry point for your main Electron process TypeScript file.
      entry: resolve(__vite_injected_original_dirname, "src/electron/main.ts"),
      // Ensure this path is correct
      // The name of the output file.
      fileName: "main",
      // Output format: CommonJS is standard for Node.js/Electron main process.
      formats: ["cjs"]
    },
    // Rollup options for fine-grained control over the bundling process.
    rollupOptions: {
      // Externalize Electron and Node.js built-in modules.
      // This prevents Vite from trying to bundle them, as they are available in the Electron environment.
      external: [
        "electron",
        // Dynamically get all Node.js built-in modules (e.g., 'path', 'fs', 'os', 'child_process').
        // This ensures they are treated as external dependencies.
        ...__require("node:module").builtinModules
      ]
    }
  },
  // Resolve aliases for easier imports within your main process code.
  resolve: {
    alias: {
      // Example: Allows you to use `@/` to refer to your 'src' directory.
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  }
});
export {
  vite_main_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5tYWluLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXExFTk9WT1xcXFxEb2N1bWVudHNcXFxcd29ya1xcXFxPZGl0b3JcXFxcb2RpdG9yd2VicG9zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRU5PVk9cXFxcRG9jdW1lbnRzXFxcXHdvcmtcXFxcT2RpdG9yXFxcXG9kaXRvcndlYnBvc1xcXFx2aXRlLm1haW4uY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MRU5PVk8vRG9jdW1lbnRzL3dvcmsvT2RpdG9yL29kaXRvcndlYnBvcy92aXRlLm1haW4uY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIC8vIFRoaXMgYnVpbGQgY29uZmlndXJhdGlvbiBpcyBzcGVjaWZpY2FsbHkgZm9yIHRoZSBFbGVjdHJvbiBNYWluIFByb2Nlc3MuXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIFRoZSBvdXRwdXQgZGlyZWN0b3J5IGZvciB0aGUgY29tcGlsZWQgbWFpbiBwcm9jZXNzIGNvZGUuXHJcbiAgICAvLyBFbGVjdHJvbiBGb3JnZSdzIFZpdGUgcGx1Z2luIHdpbGwgaGFuZGxlIG1vdmluZyB0aGlzIHRvIHRoZSBjb3JyZWN0IGxvY2F0aW9uIGluIHRoZSBmaW5hbCBwYWNrYWdlLlxyXG4gICAgb3V0RGlyOiByZXNvbHZlKF9fZGlybmFtZSwgJy52aXRlL21haW4nKSxcclxuICAgIC8vIENsZWFyIHRoZSBvdXRwdXQgZGlyZWN0b3J5IGJlZm9yZSBidWlsZGluZy5cclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgLy8gTWluaWZ5IHRoZSBvdXRwdXQgY29kZSBpZiBpbiBwcm9kdWN0aW9uIG1vZGUuXHJcbiAgICBtaW5pZnk6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXHJcbiAgICAvLyBDb25maWd1cmUgYXMgYSBsaWJyYXJ5IGJ1aWxkLCBhcyBFbGVjdHJvbiBwcm9jZXNzZXMgYXJlIGVzc2VudGlhbGx5IE5vZGUuanMgbGlicmFyaWVzLlxyXG4gICAgbGliOiB7XHJcbiAgICAgIC8vIEVudHJ5IHBvaW50IGZvciB5b3VyIG1haW4gRWxlY3Ryb24gcHJvY2VzcyBUeXBlU2NyaXB0IGZpbGUuXHJcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9lbGVjdHJvbi9tYWluLnRzJyksIC8vIEVuc3VyZSB0aGlzIHBhdGggaXMgY29ycmVjdFxyXG4gICAgICAvLyBUaGUgbmFtZSBvZiB0aGUgb3V0cHV0IGZpbGUuXHJcbiAgICAgIGZpbGVOYW1lOiAnbWFpbicsXHJcbiAgICAgIC8vIE91dHB1dCBmb3JtYXQ6IENvbW1vbkpTIGlzIHN0YW5kYXJkIGZvciBOb2RlLmpzL0VsZWN0cm9uIG1haW4gcHJvY2Vzcy5cclxuICAgICAgZm9ybWF0czogWydjanMnXSxcclxuICAgIH0sXHJcbiAgICAvLyBSb2xsdXAgb3B0aW9ucyBmb3IgZmluZS1ncmFpbmVkIGNvbnRyb2wgb3ZlciB0aGUgYnVuZGxpbmcgcHJvY2Vzcy5cclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gRXh0ZXJuYWxpemUgRWxlY3Ryb24gYW5kIE5vZGUuanMgYnVpbHQtaW4gbW9kdWxlcy5cclxuICAgICAgLy8gVGhpcyBwcmV2ZW50cyBWaXRlIGZyb20gdHJ5aW5nIHRvIGJ1bmRsZSB0aGVtLCBhcyB0aGV5IGFyZSBhdmFpbGFibGUgaW4gdGhlIEVsZWN0cm9uIGVudmlyb25tZW50LlxyXG4gICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgICdlbGVjdHJvbicsXHJcbiAgICAgICAgLy8gRHluYW1pY2FsbHkgZ2V0IGFsbCBOb2RlLmpzIGJ1aWx0LWluIG1vZHVsZXMgKGUuZy4sICdwYXRoJywgJ2ZzJywgJ29zJywgJ2NoaWxkX3Byb2Nlc3MnKS5cclxuICAgICAgICAvLyBUaGlzIGVuc3VyZXMgdGhleSBhcmUgdHJlYXRlZCBhcyBleHRlcm5hbCBkZXBlbmRlbmNpZXMuXHJcbiAgICAgICAgLi4ucmVxdWlyZSgnbm9kZTptb2R1bGUnKS5idWlsdGluTW9kdWxlcyxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBSZXNvbHZlIGFsaWFzZXMgZm9yIGVhc2llciBpbXBvcnRzIHdpdGhpbiB5b3VyIG1haW4gcHJvY2VzcyBjb2RlLlxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIC8vIEV4YW1wbGU6IEFsbG93cyB5b3UgdG8gdXNlIGBAL2AgdG8gcmVmZXIgdG8geW91ciAnc3JjJyBkaXJlY3RvcnkuXHJcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7QUFBZ1csU0FBUyxvQkFBb0I7QUFDN1gsU0FBUyxlQUFlO0FBRHhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sMkJBQVEsYUFBYTtBQUFBO0FBQUEsRUFFMUIsT0FBTztBQUFBO0FBQUE7QUFBQSxJQUdMLFFBQVEsUUFBUSxrQ0FBVyxZQUFZO0FBQUE7QUFBQSxJQUV2QyxhQUFhO0FBQUE7QUFBQSxJQUViLFFBQVEsUUFBUSxJQUFJLGFBQWE7QUFBQTtBQUFBLElBRWpDLEtBQUs7QUFBQTtBQUFBLE1BRUgsT0FBTyxRQUFRLGtDQUFXLHNCQUFzQjtBQUFBO0FBQUE7QUFBQSxNQUVoRCxVQUFVO0FBQUE7QUFBQSxNQUVWLFNBQVMsQ0FBQyxLQUFLO0FBQUEsSUFDakI7QUFBQTtBQUFBLElBRUEsZUFBZTtBQUFBO0FBQUE7QUFBQSxNQUdiLFVBQVU7QUFBQSxRQUNSO0FBQUE7QUFBQTtBQUFBLFFBR0EsR0FBRyxVQUFRLGFBQWEsRUFBRTtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
