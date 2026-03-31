import { defineConfig } from "vite";

const buildVersion = `${Date.now()}`;

export default defineConfig({
  base: "/investments/",
  plugins: [
    {
      name: "inject-build-version",
      transformIndexHtml(html) {
        return html.replaceAll("__APP_BUILD_VERSION__", buildVersion);
      },
    },
  ],
});
