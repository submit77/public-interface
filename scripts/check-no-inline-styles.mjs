import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) files.push(path);
  }
}
walk("dist");

const failures = files.filter((file) => /\sstyle\s*=/.test(readFileSync(file, "utf8")));
if (failures.length > 0) {
  console.error(`Inline style attributes reached the build:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("✓ CSP guard: no inline style attributes in dist.");
