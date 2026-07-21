import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import { PUBLIC_INTERFACE } from "@data/public-interface";
import { SITE } from "@data/site";

export const GET: APIRoute = async () => {
  const page = await getEntry("pages", "public-interface");
  if (!page) throw new Error("Missing Public Interface content");
  const lines = [
    `# ${page.data.title}`,
    "",
    `Source: ${new URL("/public-interface/", SITE.url).href}`,
    "",
    `> ${PUBLIC_INTERFACE.definition}`,
    "",
    (page.body ?? "").trim(),
    "",
    "## Current stage",
    "",
    PUBLIC_INTERFACE.stage,
    "",
    `Trust boundary: ${PUBLIC_INTERFACE.trustBoundary}`,
    "",
    "## Deployed capabilities",
    "",
  ];
  for (const capability of PUBLIC_INTERFACE.capabilities) {
    lines.push(
      `- **${capability.name}** — ${capability.route} (${capability.mediaType}). ${capability.use}`
    );
  }
  lines.push(
    "",
    `Action layer: ${PUBLIC_INTERFACE.actionLayer.status}`,
    `Delegated authority: ${PUBLIC_INTERFACE.actionLayer.authority}`,
    ""
  );
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
