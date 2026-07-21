# Agent operating rules

This repository is canonical. Read this file before changing it.

## Goals

- Preserve static HTML and minimal browser JavaScript.
- Keep content in `src/content` or `src/data`, never hardcoded in components.
- Generate machine-readable representations from canonical content.
- Keep capability claims no broader than deployed, inspectable interfaces.

## Hard rules

- Do not invent biographical, organizational, performance, or outcome claims.
- Do not commit credentials, private material, `.env` files, or production data.
- Do not add dependencies without a demonstrated requirement.
- Use Markdown unless custom components genuinely require MDX.
- Treat the permissioned action layer as out of scope.
- Run `pnpm format` and `pnpm build` before proposing a release.

## Design system

Visual decisions live in `src/styles/tokens.css`; components consume semantic
tokens. Prefer existing components and tokens before adding new ones.

## Content compiler

The build generates Markdown mirrors, JSON-LD, feeds, sitemap, `llms.txt`, and the
capability manifest. Do not hand-maintain generated outputs.
