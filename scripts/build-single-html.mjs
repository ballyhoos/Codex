import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const distIndexPath = path.join(distDir, "index.html");
const outputPath = path.join(distDir, "investments.app.html");

if (!fs.existsSync(distIndexPath)) {
  throw new Error("dist/index.html not found. Run `npm run build` first.");
}

let html = fs.readFileSync(distIndexPath, "utf8");

const jsTagMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const cssTagMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);

if (!jsTagMatch || !cssTagMatch) {
  throw new Error("Could not find built JS/CSS asset tags in dist/index.html.");
}

const jsAssetPath = path.join(distDir, jsTagMatch[1].replace(/^\//, ""));
const cssAssetPath = path.join(distDir, cssTagMatch[1].replace(/^\//, ""));

const js = fs.readFileSync(jsAssetPath, "utf8");
const css = fs.readFileSync(cssAssetPath, "utf8");

html = html.replace(cssTagMatch[0], `<style>\n${css}\n</style>`);
html = html.replace(jsTagMatch[0], `<script type="module">\n${js}\n</script>`);

fs.writeFileSync(outputPath, html);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
