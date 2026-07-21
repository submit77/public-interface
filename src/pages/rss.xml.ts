import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@data/site";

export async function GET() {
  const entries = (await getCollection("writing", (entry) => !entry.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: `${SITE.name} — Writing`,
    description: SITE.description,
    site: SITE.url,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/writing/${entry.id}/`,
    })),
  });
}
