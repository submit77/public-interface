export const ARCHITECTURE = {
  version: "2026.07.21.1",
  status: "Reference implementation",
  updated: "2026-07-21",
  verifiedAt: "2026-07-21",
  layers: [
    ["Source", "Typed Markdown and TypeScript data", "One canonical source"],
    ["Compiler", "Astro static build", "HTML and machine representations"],
    ["Gate", "Type, artifact, link, schema, and CSP guards", "Invalid releases fail"],
    ["Delivery", "Any static host", "No application server or database"],
    ["Reality check", "Optional scheduled live QC", "Deployment is checked independently"],
  ],
  metrics: [
    {
      measure: "Build integrity",
      target: "All guards pass",
      actual: "Measured during each build",
      status: "configured",
      kind: "Internal validation",
    },
    {
      measure: "Deployed performance",
      target: "Define for each deployment",
      actual: "Unmeasured fixture",
      status: "pending deployment",
      kind: "External lab or field",
    },
    {
      measure: "Structured data",
      target: "0 parser errors",
      actual: "Validated during build",
      status: "configured",
      kind: "Build validation",
    },
  ],
  changes: [
    {
      date: "2026-07-21",
      change:
        "Published the clean-history static reference implementation with synthetic fixtures.",
    },
  ],
} as const;
