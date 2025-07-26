// vite.renderer.config.ts
import { defineConfig } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import Components from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/unplugin-vue-components/dist/resolvers.js";
import { viteStaticCopy } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/node_modules/vite-plugin-static-copy/dist/index.js";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorwebpos/vite.renderer.config.ts";
var vite_renderer_config_default = defineConfig({
  base: "./",
  // ✅ THIS FIXES YOUR CORS + file:// PROBLEMS
  plugins: [
    vue(),
    VueDevTools(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })]
    }),
    viteStaticCopy({
      targets: [{ src: "_redirects", dest: "." }]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_renderer_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5yZW5kZXJlci5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRU5PVk9cXFxcRG9jdW1lbnRzXFxcXHdvcmtcXFxcT2RpdG9yXFxcXG9kaXRvcndlYnBvc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTEVOT1ZPXFxcXERvY3VtZW50c1xcXFx3b3JrXFxcXE9kaXRvclxcXFxvZGl0b3J3ZWJwb3NcXFxcdml0ZS5yZW5kZXJlci5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0xFTk9WTy9Eb2N1bWVudHMvd29yay9PZGl0b3Ivb2RpdG9yd2VicG9zL3ZpdGUucmVuZGVyZXIuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEFudERlc2lnblZ1ZVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5J1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6ICcuLycsIC8vIFx1MjcwNSBUSElTIEZJWEVTIFlPVVIgQ09SUyArIGZpbGU6Ly8gUFJPQkxFTVNcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIFZ1ZURldlRvb2xzKCksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbQW50RGVzaWduVnVlUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogZmFsc2UgfSldLFxyXG4gICAgfSksXHJcbiAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgIHRhcmdldHM6IFt7IHNyYzogJ19yZWRpcmVjdHMnLCBkZXN0OiAnLicgfV0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdXLFNBQVMsb0JBQW9CO0FBQ3JZLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDRCQUE0QjtBQUNyQyxTQUFTLHNCQUFzQjtBQUMvQixTQUFTLHFCQUFxQjtBQU5vTSxJQUFNLDJDQUEyQztBQVFuUixJQUFPLCtCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUE7QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUNaLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxhQUFhLE1BQU0sQ0FBQyxDQUFDO0FBQUEsSUFDMUQsQ0FBQztBQUFBLElBQ0QsZUFBZTtBQUFBLE1BQ2IsU0FBUyxDQUFDLEVBQUUsS0FBSyxjQUFjLE1BQU0sSUFBSSxDQUFDO0FBQUEsSUFDNUMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
