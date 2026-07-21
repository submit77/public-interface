import { SITE } from "@data/site";

const abs = (path: string) => new URL(path, SITE.url).href;

export const PUBLIC_INTERFACE = {
  name: "Public Interface",
  definition:
    "A durable point of contact between a person, organization, or project and the world: readable by people, understandable by machines, and explicit about what can and cannot be done through it.",
  stage: "Public read and routing layer",
  trustBoundary:
    "This deployment publishes information and a contact route. It does not authenticate agents, delegate authority, or execute transactions.",
  capabilities: [
    {
      name: "Site",
      route: abs("/"),
      mediaType: "text/html",
      use: "Read the canonical public presentation.",
    },
    {
      name: "Writing mirrors",
      route: `${SITE.url}/writing/{slug}.md`,
      mediaType: "text/markdown",
      use: "Retrieve an entry without presentation markup.",
    },
    {
      name: "LLM index",
      route: abs("/llms.txt"),
      mediaType: "text/plain",
      use: "Orient a language model to the public material.",
    },
    {
      name: "Capability manifest",
      route: abs("/capabilities.json"),
      mediaType: "application/json",
      use: "Inspect the current public interfaces and trust boundary.",
    },
    {
      name: "Evidence",
      route: abs("/evidence/"),
      mediaType: "text/html",
      use: "Inspect dated claims and their public sources.",
    },
    {
      name: "Contact",
      route: `mailto:${SITE.contact}`,
      mediaType: "message/rfc822",
      use: "Route context to the published contact channel.",
    },
  ],
  actionLayer: {
    status: "not-implemented",
    authority: "none",
    operations: [],
  },
} as const;
