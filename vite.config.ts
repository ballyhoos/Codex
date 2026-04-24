import { defineConfig } from "vite";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getLocalBuildVersion(): string {
  const now = new Date();
  const year = pad2(now.getFullYear() % 100);
  const month = pad2(now.getMonth() + 1);
  const day = pad2(now.getDate());
  const hours = pad2(now.getHours());
  const minutes = pad2(now.getMinutes());
  return `${year}${month}${day}-${hours}${minutes}`;
}

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "inject-build-version",
      transformIndexHtml(html) {
        const buildVersion = getLocalBuildVersion();
        return html.replaceAll("__APP_BUILD_VERSION__", buildVersion);
      },
    },
  ],
});
