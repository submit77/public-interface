# Architecture contract

Public Interface is a content compiler with a static delivery target.

## Invariants

1. Authored content and typed data are canonical.
2. Alternate public representations are derived during the build.
3. Static HTML is the default response; browser JavaScript is exceptional.
4. A malformed entry, broken link, invalid JSON-LD document, missing mirror, or
   missing interface declaration blocks release.
5. The deployed surface is checked independently of the build.
6. Public discovery never grants authority to act.

## Trust domains

The repository implements anonymous public reading and contact routing. A future
permissioned action system is out of scope and must not be smuggled into this
static deployment. If built, it requires a separate threat model and release
boundary.

## Versioning

The canonical `/architecture/` route is an always-current release record. A
date-based version identifies the implementation state described there. Material
changes advance that version and add a curated changelog entry.

## Portability

Astro and the static host are implementation choices. The durable pattern is:
author once, derive representations, guard invariants, deploy statically, and check
the deployed result.
