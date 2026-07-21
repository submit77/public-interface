import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import { ARCHITECTURE } from "@data/architecture";
import { SITE } from "@data/site";

export const GET: APIRoute = async () => {
  const page = await getEntry("pages", "architecture");
  if (!page) throw new Error("Missing Architecture content");
  const lines = [
    `# ${page.data.title}`,
    "",
    `Source: ${new URL("/architecture/", SITE.url).href}`,
    `Version: ${ARCHITECTURE.version}`,
    `Status: ${ARCHITECTURE.status}`,
    `Updated: ${ARCHITECTURE.updated}`,
    `Verified: ${ARCHITECTURE.verifiedAt}`,
    "",
    `> ${page.data.intro}`,
    "",
    (page.body ?? "").trim(),
    "",
    "## Implementation",
    "",
  ];
  for (const [layer, implementation, property] of ARCHITECTURE.layers) {
    lines.push(`- **${layer}.** ${implementation}. ${property}.`);
  }
  lines.push("", "## Measurement structure", "");
  for (const metric of ARCHITECTURE.metrics) {
    lines.push(
      `- **${metric.measure}.** ${metric.actual}. Target: ${metric.target}. ${metric.kind}; ${metric.status}.`
    );
  }
  lines.push("", "## Changes", "");
  for (const item of ARCHITECTURE.changes) lines.push(`- **${item.date}.** ${item.change}`);
  lines.push("");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
