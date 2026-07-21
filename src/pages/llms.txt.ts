import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { PUBLIC_INTERFACE } from "@data/public-interface";
import { SITE } from "@data/site";

const abs = (path: string) => new URL(path, SITE.url).href;

export const GET: APIRoute = async () => {
  const writing = (await getCollection("writing", (entry) => !entry.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const evidence = (await getCollection("evidence", (entry) => !entry.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Current stage: ${PUBLIC_INTERFACE.stage}`,
    `Trust boundary: ${PUBLIC_INTERFACE.trustBoundary}`,
    "",
    "## Core interfaces",
    "",
    `- [Public Interface](${abs("/public-interface/")}): definition and current contract.`,
    `- [Architecture](${abs("/architecture/")}): implementation and verification record.`,
    `- [Capability manifest](${abs("/capabilities.json")}): structured deployed interfaces.`,
    `- [Writing corpus](${abs("/llms-full.txt")}): concatenated public writing.`,
    "",
    "## Writing",
    "",
  ];
  for (const entry of writing) {
    lines.push(
      `- [${entry.data.title}](${abs(`/writing/${entry.id}/`)}): ${entry.data.description} ([Markdown](${abs(`/writing/${entry.id}.md`)}))`
    );
  }
  lines.push("", "## Evidence", "");
  for (const entry of evidence) {
    lines.push(`- ${entry.data.date.toISOString().slice(0, 10)} — ${entry.data.summary}`);
  }
  lines.push("");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
