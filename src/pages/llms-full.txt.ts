import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@data/site";

export const GET: APIRoute = async () => {
  const writing = (await getCollection("writing", (entry) => !entry.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const lines = [`# ${SITE.name} — public writing`, ""];
  for (const entry of writing) {
    lines.push(
      `## ${entry.data.title}`,
      "",
      `${entry.data.type} · ${entry.data.date.toISOString().slice(0, 10)}`,
      `Source: ${new URL(`/writing/${entry.id}/`, SITE.url).href}`,
      "",
      (entry.body ?? "").trim(),
      "",
      "---",
      ""
    );
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
