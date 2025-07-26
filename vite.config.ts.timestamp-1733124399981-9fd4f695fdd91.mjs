// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import Components from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/node_modules/unplugin-vue-components/dist/resolvers.js";
import { viteStaticCopy } from "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/LENOVO/Documents/work/Oditor/oditorappwebui/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
          // css in js
        })
      ]
    }),
    viteStaticCopy({
      targets: [
        {
          src: "_redirects",
          dest: "."
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRU5PVk9cXFxcRG9jdW1lbnRzXFxcXHdvcmtcXFxcT2RpdG9yXFxcXG9kaXRvcmFwcHdlYnVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRU5PVk9cXFxcRG9jdW1lbnRzXFxcXHdvcmtcXFxcT2RpdG9yXFxcXG9kaXRvcmFwcHdlYnVpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MRU5PVk8vRG9jdW1lbnRzL3dvcmsvT2RpdG9yL29kaXRvcmFwcHdlYnVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHNcIjtcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcclxuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgVnVlRGV2VG9vbHMoKSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICBBbnREZXNpZ25WdWVSZXNvbHZlcih7XHJcbiAgICAgICAgICBpbXBvcnRTdHlsZTogZmFsc2UsIC8vIGNzcyBpbiBqc1xyXG4gICAgICAgIH0pLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IFwiX3JlZGlyZWN0c1wiLFxyXG4gICAgICAgICAgZGVzdDogXCIuXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VixTQUFTLGVBQWUsV0FBVztBQUUvWCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyxzQkFBc0I7QUFQOEwsSUFBTSwyQ0FBMkM7QUFVOVEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLElBQ1osV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBLFFBQ1QscUJBQXFCO0FBQUEsVUFDbkIsYUFBYTtBQUFBO0FBQUEsUUFDZixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
