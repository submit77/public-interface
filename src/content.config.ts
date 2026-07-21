import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    type: z.enum(["Essay", "Note", "Technical note"]).default("Note"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const evidence = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/evidence" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    source: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, writing, evidence };
