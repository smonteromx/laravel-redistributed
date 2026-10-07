---
name: identity-and-design-systems
description: Structure visual identity systems and design systems on a design canvas (Paper, Figma, Pencil). Use when creating, restructuring or auditing a design system, its design tokens, or a brand identity (logo, symbol, wordmark, mascot), including brand-only work for ventures with no interface.
---

# Identity and design systems

This skill owns the **structure** of an identity system and a design system: what each contains, how it sits on the canvas, which token contract it follows, and what it hands to implementation. **Taste** (the mood, the values, the typefaces, the drawing of a mark) belongs to a **companion** design skill running alongside. Every value is derived fresh from the product in front of you; structure is the only thing that carries from one system to the next, so a motif, a palette, a ligature or a cover device from an earlier system stays there.

The resulting system is stack-agnostic. Its boards may name CSS, Tailwind CSS and the chosen icon family, because those three shape how tokens are named and derived; everything else about implementation lives in the codebase.

## Steps

1. **Intake.** Settle each item from the request, the repo and the canvas; ask the user for whatever remains, in one round.
   - **Platform**: the canvas the work happens in (Figma, Paper, Pencil, …). Read [references/platforms.md](references/platforms.md) and inspect what its token store can hold.
   - **Scope**: identity system, design system, or both.
   - **Kind**: a product with an interface, or a brand for a venture with none (a bakery, a studio, an event). The second takes the [brand-only branch](#brand-only-branch).
   - **Companion**: the taste skill that drives values. Use the one the user names; otherwise check what is installed and recommend one: `impeccable`, `design-taste-frontend` (`Leonxlnx/taste-skill`), `emil-design-eng` (`emilkowalski/skills`), or another design skill recognised at the time. Load it before step 2.
   - **Product context**: who uses it, where, under what conditions, what it must never resemble, and the accessibility standard it commits to. Read the project's product and context documents when they exist.
   - **Records**: look for a documentation convention (an ADR folder, a glossary or context file, a product brief) and follow it. When none exists, ask whether the user wants decisions recorded, and recommend `setup-matt-pocock-skills` plus `domain-modeling` (`mattpocock/skills`) for ADRs and a context file, with `impeccable` for the product brief. Ask now when product context is missing; otherwise ask at step 7.

   Done when: every item has an answer, or a stated default with its reason.

2. **Direction.** With the companion, take several genuinely different directions to completion on the same **proof surface** (a cover plus one representative screen or application), then choose. A direction is a named world: one concrete scene every color, typeface and shape traces back to. Write its translation per dimension: color, typography, shape, imagery, motion, voice. Keep the discarded directions on their own page as the record of why. Done when: one direction is chosen and its translation covers every dimension in scope.

3. **Identity** (when scope includes it). Choose the mark architecture, then build construction, variants, rules and the asset inventory as [references/identity.md](references/identity.md) lays out. Done when: every variant in the inventory exists on the canvas with its construction, clearspace, minimum size and misuse examples.

4. **Token contract** (when scope includes the design system). Build color on the four-role contract in [references/color.md](references/color.md), putting its open questions to the user or deciding them for the product. Then build only the foundations this product uses, per [references/foundations.md](references/foundations.md). Done when: every token carries one written **job**, every pair passes the declared contrast floor in both modes, and every foundation is built or marked as not needed.

5. **Native tokens.** Create the contract in the platform's own token store before drawing boards, and bind every swatch, specimen and mock to it (`var(--color-…)`), so editing a token restyles the canvas. Where the platform lacks a type or a mode, apply the workaround in [references/platforms.md](references/platforms.md). Skip this step when the platform has no token store. Done when: the store holds the whole contract and the canvas references tokens wherever the platform allows.

6. **Boards.** Lay the system out as described in [Board structure](#board-structure). Done when: every board in scope exists, its visible text names no tooling beyond CSS, Tailwind and the icon family, and open decisions sit on the canvas.

7. **Record.** In the convention settled at intake, record each decision a future reader would otherwise reverse: a meaning given to a color, an authorised exception, a rejected direction or option. Done when: each such decision is recorded, or the user declined records.

## Board structure

Pages, in order:

- **Directions**: every explored direction, kept after the choice.
- **System**: numbered boards, read left to right:
  1. **Cover and direction**: the lockup, descriptor, version and status, the named world and its translation table.
  2. **Identity**: the mark, its construction, variants with when to use each, misuse.
  3. **Color**: every base and brand token in both modes, each with its value and job.
  4. **Emphasis, data and navigation**: each emphasis family in use (a filled action beside a tinted notice) next to its four roles, per mode; the chart series; the navigation set.
  5. **Typography**: families with their jobs; the scale, each size with its pairs and where it is used.
  6. **Foundations**: the foundations step 4 kept, each scale's base step highlighted in primary.
  7. **Signature pattern**: only when the product has an interaction its category lacks; defined at full detail.
  8. **Rules**: every system rule in one place, grouped by dimension and phrased as what to do. A rule that only reads beside its example stays on that example's board.
  9. **Delivery**: what implementation receives: naming, bases and derivations, aliases, whatever the platform could not store and where it lives instead, vocabulary rules, the asset list, open decisions.
- **Brand assets**: production artwork: symbol, wordmark, custom glyphs, app icon and favicon, social cover, and an inventory board.

Drop the boards outside scope and renumber. Applied components and screens come later, through the companion's workflow.

Canvas conventions:

- The design file is the **source of truth** for visual values: a value changes there first, then in implementation, and every pair it touches is re-verified.
- Print each swatch's value beneath it as `L C H`. Printed labels are static text: re-set them whenever a value changes.
- Split a row that overflows into equal lanes and pad the short row with an empty lane, so columns stay aligned.
- An undecided question goes on the canvas as a visible open-decision card, in the preventive tint.

## Brand-only branch

A brand with no interface keeps the structure and sheds the interface contract:

- **Boards**: cover and direction, identity, a brand palette, typography, rules, delivery, and brand assets. Add an **applications** board for where the brand lives (signage, packaging, stationery, social templates, menus).
- **Color**: brand colors with a job each, in oklch plus the values its media need (hex for screens, CMYK or a spot reference for print). The UI roles (input, ring, sidebar, charts, states) stay out unless the brand also gets a website, in which case that site takes the full contract.
- **Foundations**: only what the applications use, typically a type scale and a grid.
- **Tokens**: still created when the platform has a store, since they keep the file consistent.
