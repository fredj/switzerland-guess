import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const cesiumSource = "node_modules/@cesium/engine";

// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumBaseUrl = "cesiumStatic";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          cesium: ["@cesium/engine"],
          countries: ["./data/countries.json"],
        },
      },
    },
  },
  define: {
    // Define relative base path in cesium for loading assets
    // https://vitejs.dev/config/shared-options.html#define
    CESIUM_BASE_URL: `"${cesiumBaseUrl}"`,
  },
  plugins: [
    // Copy Cesium Assets, Widgets, and Workers to a static directory.
    // If you need to add your own static files to your project, use the `public` directory
    // and other options listed here: https://vitejs.dev/guide/assets.html#the-public-directory
    viteStaticCopy({
      targets: [
        { src: "models", dest: "" },
        { src: "images", dest: "" },
        { src: "fonts", dest: "" },
        { src: `${cesiumSource}/Build/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Build/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Source/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Source/Widget`, dest: cesiumBaseUrl },
      ],
    }),
  ],
});
