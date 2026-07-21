import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { SITE } from "@data/site";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("writing", (entry) => !entry.data.draft);
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const entry = props.entry as CollectionEntry<"writing">;
  const lines = [
    `# ${entry.data.title}`,
    "",
    `${entry.data.type} · ${entry.data.date.toISOString().slice(0, 10)}`,
    `Source: ${new URL(`/writing/${entry.id}/`, SITE.url).href}`,
    "",
    `> ${entry.data.description}`,
    "",
    (entry.body ?? "").trim(),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
