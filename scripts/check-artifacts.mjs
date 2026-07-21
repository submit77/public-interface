import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const failures = [];
const fail = (message) => failures.push(message);

function htmlFiles(dir, output = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) htmlFiles(path, output);
    else if (name.endsWith(".html")) output.push(path);
  }
  return output;
}

for (const file of [
  "index.html",
  "public-interface/index.html",
  "public-interface.md",
  "architecture/index.html",
  "architecture.md",
  "capabilities.json",
  "llms.txt",
  "llms-full.txt",
  "rss.xml",
  "sitemap-index.xml",
]) {
  if (!existsSync(join(DIST, file))) fail(`Missing dist/${file}`);
}

const llms = existsSync(join(DIST, "llms.txt")) ? readFileSync(join(DIST, "llms.txt"), "utf8") : "";
const writingDir = join(DIST, "writing");
if (existsSync(writingDir)) {
  for (const name of readdirSync(writingDir)) {
    const html = join(writingDir, name, "index.html");
    if (!existsSync(html)) continue;
    const mirror = join(writingDir, `${name}.md`);
    if (!existsSync(mirror)) fail(`Missing writing mirror ${mirror}`);
    if (!llms.includes(`/writing/${name}/`)) fail(`llms.txt omits /writing/${name}/`);
    const markup = readFileSync(html, "utf8");
    if (!markup.includes('type="text/markdown"') || !markup.includes(`/writing/${name}.md`)) {
      fail(`${html} does not advertise its Markdown alternate`);
    }
  }
}

for (const page of ["public-interface", "architecture"]) {
  const html = join(DIST, page, "index.html");
  const mirror = join(DIST, `${page}.md`);
  if (existsSync(html)) {
    const markup = readFileSync(html, "utf8");
    if (!markup.includes('type="text/markdown"') || !markup.includes(`/${page}.md`)) {
      fail(`${html} does not advertise its Markdown alternate`);
    }
  }
  if (!llms.includes(`/${page}/`)) fail(`llms.txt omits /${page}/`);
  if (!existsSync(mirror)) fail(`Missing ${mirror}`);
}

if (existsSync(join(DIST, "architecture.md"))) {
  const architecture = readFileSync(join(DIST, "architecture.md"), "utf8");
  if (!/^Version: \d{4}\.\d{2}\.\d{2}\.\d+$/m.test(architecture)) {
    fail("architecture.md has no date-based version");
  }
  if (!/^Verified: \d{4}-\d{2}-\d{2}$/m.test(architecture)) {
    fail("architecture.md has no verification date");
  }
}

if (existsSync(join(DIST, "capabilities.json"))) {
  try {
    const capabilities = JSON.parse(readFileSync(join(DIST, "capabilities.json"), "utf8"));
    if (!capabilities.trustBoundary || capabilities.actionLayer?.status !== "not-implemented") {
      fail("Capability manifest overstates or omits the trust boundary");
    }
    if (
      capabilities.actionLayer?.authority !== "none" ||
      capabilities.actionLayer?.operations?.length
    ) {
      fail("Capability manifest claims undeployed authority or operations");
    }
    for (const file of [
      join(DIST, "public-interface", "index.html"),
      join(DIST, "public-interface.md"),
    ]) {
      if (existsSync(file) && !readFileSync(file, "utf8").includes(capabilities.trustBoundary)) {
        fail(`${file} does not match the capability manifest trust boundary`);
      }
    }
  } catch {
    fail("capabilities.json does not parse");
  }
}

const linkPattern = /(?:href|src)="([^"]+)"/g;
const skip = /^(https?:|mailto:|tel:|data:|#|\/\/)/;
function resolves(url) {
  const path = url.split(/[?#]/)[0];
  if (path === "/") return existsSync(join(DIST, "index.html"));
  if (path.endsWith("/")) return existsSync(join(DIST, path, "index.html"));
  const last = path.split("/").pop();
  if (last.includes(".")) return existsSync(join(DIST, path));
  return existsSync(join(DIST, path, "index.html")) || existsSync(join(DIST, `${path}.html`));
}

const jsonLdPattern = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
let jsonLdCount = 0;
for (const file of htmlFiles(DIST)) {
  const markup = readFileSync(file, "utf8");
  for (const match of markup.matchAll(linkPattern)) {
    const url = match[1];
    if (!url.startsWith("/") || skip.test(url)) continue;
    if (!resolves(url)) fail(`Broken internal link ${url} in ${file}`);
  }
  const documents = [];
  for (const match of markup.matchAll(jsonLdPattern)) {
    jsonLdCount++;
    try {
      const document = JSON.parse(match[1]);
      if (!document["@context"] || !document["@type"]) fail(`Incomplete JSON-LD in ${file}`);
      documents.push(document);
    } catch {
      fail(`Invalid JSON-LD in ${file}`);
    }
  }
  const normalized = file.replaceAll("\\", "/");
  if (normalized !== "dist/index.html" && normalized !== "dist/404.html") {
    if (!documents.some((document) => document["@type"] === "BreadcrumbList")) {
      fail(`Missing breadcrumbs in ${file}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`\nArtifact guard found ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`✓ Artifact guard passed with ${jsonLdCount} JSON-LD documents.`);
