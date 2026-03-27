/**
 * Run once: node copy-world-map.mjs
 * Copies the world map SVG from @svg-maps/world into public/maszAssets/
 */
import { copyFileSync } from "fs";
import { createRequire } from "module";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const pkgPath = require.resolve("@svg-maps/world/world.svg");
const dest = resolve(__dirname, "public/maszAssets/world-map.svg");

copyFileSync(pkgPath, dest);
console.log("✅  Copied to public/maszAssets/world-map.svg");
