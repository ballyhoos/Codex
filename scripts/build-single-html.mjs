import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const distIndexPath = path.join(distDir, "index.html");
const docsDir = path.resolve("docs");
const docsIndexPath = path.join(docsDir, "index.html");
const shouldWriteVersioned = process.env.GENERATE_VERSIONED_HTML === "1";
const versionedOutputDir = path.resolve(process.env.VERSIONED_HTML_DIR || "dist");

if (!fs.existsSync(distIndexPath)) {
  throw new Error("dist/index.html not found. Run `npm run build` first.");
}

let html = fs.readFileSync(distIndexPath, "utf8");
const buildVersionMatch = html.match(/<meta name="app-build-version" content="([^"]+)"/);
const buildVersion = buildVersionMatch?.[1] || Date.now().toString();
const versionedOutputPath = path.join(versionedOutputDir, `investments.app.v${buildVersion}.html`);

const jsTagMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const cssTagMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);

if (!jsTagMatch || !cssTagMatch) {
  throw new Error("Could not find built JS/CSS asset tags in dist/index.html.");
}

function resolveBuiltAssetPath(assetRef) {
  const normalized = assetRef.replace(/^https?:\/\/[^/]+/, "").replace(/^\//, "");
  const withoutBase = normalized.startsWith("investments/")
    ? normalized.slice("investments/".length)
    : normalized;
  return path.join(distDir, withoutBase);
}

const jsAssetPath = resolveBuiltAssetPath(jsTagMatch[1]);
const cssAssetPath = resolveBuiltAssetPath(cssTagMatch[1]);

const js = fs.readFileSync(jsAssetPath, "utf8");
const css = fs.readFileSync(cssAssetPath, "utf8");
const jsBase64 = Buffer.from(js, "utf8").toString("base64");
const safeCss = css.replace(/<\/style>/gi, "<\\/style>");
const jsLoader = `<script type="module">
const binary = atob("${jsBase64}");
const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
const blob = new Blob([bytes], { type: "text/javascript;charset=utf-8" });
const moduleUrl = URL.createObjectURL(blob);
import(moduleUrl).finally(() => URL.revokeObjectURL(moduleUrl));
</script>`;

html = html.replace(cssTagMatch[0], `<style>\n${safeCss}\n</style>`);
html = html.replace(jsTagMatch[0], jsLoader);

if (shouldWriteVersioned) {
  if (!fs.existsSync(versionedOutputDir)) {
    fs.mkdirSync(versionedOutputDir, { recursive: true });
  }
  fs.writeFileSync(versionedOutputPath, html);
  console.log(`Wrote ${path.relative(process.cwd(), versionedOutputPath)}`);
}

fs.writeFileSync(distIndexPath, html);
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}
fs.writeFileSync(docsIndexPath, html);
console.log(`Updated ${path.relative(process.cwd(), distIndexPath)} (self-contained)`);
console.log(`Copied ${path.relative(process.cwd(), docsIndexPath)} (for GitHub Pages)`);
