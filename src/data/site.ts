const configuredUrl = process.env.SITE_URL || "https://example.com";

export const SITE = {
  name: "Example Project",
  url: configuredUrl.replace(/\/$/, ""),
  title: "Example Project",
  titleTemplate: "%s — Example Project",
  description: "A synthetic Public Interface reference implementation.",
  author: "Example Project",
  contact: "contact@example.com",
  locale: "en_US",
} as const;
