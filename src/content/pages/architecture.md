---
title: Architecture
intro: "The always-current implementation record: objectives, layers, interfaces, verification, changes, and limitations."
---

## Objective

Keep the public artifact durable, legible, portable, inexpensive to operate, and
safe to change with human or agent assistance.

## Non-goals

This reference is not a CMS, analytics stack, browser application, or agent
transaction system. Add machinery only when a concrete capability requires it.

## Maintenance contract

Advance the version when the architecture, public interfaces, deployment path,
security boundary, privacy posture, or measurement system materially changes.
Update `verifiedAt` whenever the described state is systematically rechecked.
