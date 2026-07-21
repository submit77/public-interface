// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/data/site.ts";

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "ignore",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
    },
  },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes("/404") })],
  markdown: { syntaxHighlight: "prism" },
});
