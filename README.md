# Public Interface

A static-first reference implementation for a durable public interface: readable
by people, understandable by machines, and explicit about what can and cannot be
done through it.

This repository implements a **public read and routing layer**. It publishes
canonical information, evidence, feeds, structured data, plain-text mirrors, and a
contact route. It does not authenticate agents, delegate authority, or execute
transactions.

## Included

- Astro static output with strict TypeScript and near-zero browser JavaScript.
- Typed Markdown collections; malformed entries fail the build.
- Generated HTML, Markdown mirrors, JSON-LD, RSS, sitemap, `llms.txt`, and a
  capability manifest from the same source.
- Versioned `/architecture/` and `/public-interface/` records with Markdown
  mirrors.
- Build guards for missing artifacts, broken links, invalid JSON-LD, missing
  alternates, and inline style attributes.
- Optional live HTTP QC for a deployed instance.
- Explicit repository instructions for bounded agent-assisted changes.

## Not included

- A CMS, database, application server, or client-side framework.
- Analytics or advertising tags.
- Authentication, delegated authorization, payments, transactions, or agent
  execution.
- Production content or configuration from any private deployment.

Any future action layer should be a separate trust domain with its own identity,
authorization, revocation, state, idempotency, audit, and failure model.

## Start

```bash
corepack enable
pnpm install
pnpm dev
```

Requires Node 22+ and pnpm 10+.

Before deploying:

1. Replace the synthetic content in `src/content` and `src/data`.
2. Set `SITE_URL` to the canonical production origin.
3. Review the structured-data identity in `src/data/site.ts`.
4. Run `pnpm format` and `pnpm build`.
5. Deploy `dist/` to any static host.
6. Run `node scripts/live-qc.mjs https://your-domain.example`.

## Architecture

```text
typed content + structured data
              │
              ▼
      Astro static compiler
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
  HTML     Markdown    discovery,
            mirrors    feeds, JSON-LD
    └─────────┼──────────┘
              ▼
      build-time invariants
              │
              ▼
         static hosting
              │
              ▼
       scheduled live QC
```

The authored source is canonical. Machine-facing representations are generated,
not maintained as sidecars.

See [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`SECURITY.md`](SECURITY.md).

## Production reference

[jayweeldreyer.com](https://jayweeldreyer.com) is the production instance from
which the general pattern was extracted. Its content and private repository history
are not part of this project.

## License

Code and synthetic fixture content are licensed under the MIT License.
