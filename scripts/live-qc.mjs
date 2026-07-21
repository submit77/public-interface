const BASE = (process.argv[2] || process.env.PUBLIC_INTERFACE_BASE_URL || "").replace(/\/$/, "");
if (!BASE) {
  console.error("Provide a deployed origin: node scripts/live-qc.mjs https://example.com");
  process.exit(1);
}

const failures = [];
async function get(path) {
  try {
    const response = await fetch(`${BASE}${path}`, {
      redirect: "follow",
      headers: { "User-Agent": "public-interface-live-qc" },
    });
    return { status: response.status, body: await response.text() };
  } catch (error) {
    return { status: 0, body: "", error: String(error) };
  }
}

async function expect(path, markers = []) {
  const result = await get(path);
  if (result.status !== 200) return failures.push(`${path} returned ${result.status}`);
  for (const marker of markers) {
    if (!result.body.includes(marker))
      failures.push(`${path} is missing ${JSON.stringify(marker)}`);
  }
}

await expect("/", ["Example Project"]);
await expect("/public-interface/", ["not authenticate agents", '"@type":"WebPage"']);
await expect("/architecture/", ["Reference implementation", '"@type":"TechArticle"']);
await expect("/public-interface.md", ["Trust boundary:"]);
await expect("/architecture.md", ["Version:", "Verified:"]);
await expect("/capabilities.json", ['"not-implemented"']);
await expect("/llms.txt", ["Public Interface", "Architecture"]);

const missing = await get("/this-path-should-not-exist-zzz");
if (missing.status !== 404) failures.push(`Missing path returned ${missing.status}, expected 404`);

if (failures.length > 0) {
  console.error(`\nLive QC failed against ${BASE}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`✓ Live QC passed against ${BASE}.`);
