# Platforms

## Capability map

Before creating tokens, list what the platform's token store can hold and write the map on the delivery board:

| Need | Native? | Where it lives otherwise |
| --- | --- | --- |
| Color, both modes | per platform | see below |
| Font family, size, weight, tracking, leading | per platform | a specimen board with printed values |
| Spacing, radius, breakpoints, containers | per platform | a scale board with printed values |
| Shadows | per platform | swatches plus one canonical CSS block per mode |
| Durations, easings | per platform | a motion card with printed values |
| Per-size pairs (`--text-*--line-height`) | rarely | the typography board's pairs column |

Inspect the platform's tools or documentation to fill the map; an unknown capability is checked, not assumed.

**Modes.** When the store holds modes (light and dark), use them with one name per token. When it holds a single value per token, mirror the dark mode as prefixed tokens (`--color-dark-background`, `--color-dark-primary`, …) and note on the delivery board that both collapse under the unprefixed name in implementation, one value per mode. Prefixed tokens beat hard-coded literals: dark boards stay bound and editable.

**Renames and deletes.** Rename tokens through the platform so references follow; deleting a token still in use leaves dangling references, so re-point first.

## Paper

- Load `get_guide({ topic: "paper-mcp-instructions" })` once per session.
- Token types: color, font family, font size, font weight, letter spacing, line height, spacing, radius, breakpoint, container, opacity. One value per token, no modes (use the `--color-dark-*` mirror). No shadow, duration or easing type; no double-dash names, so per-size pairs live on the typography board.
- `get_tokens` exports the store as CSS or as a Tailwind v4 `@theme` block, which is the delivery format implementation reads.
- `set_tokens` with a new name rewrites every reference.
- The canvas previews rem poorly for type: a rem font size renders small and a rem line height distorts. Keep rem in token values and printed labels, render type specimens in px. `border-radius: var(--radius-*)` renders correctly; bind radii directly.
- Inline `flex: 1` from `write_html` is sometimes dropped; set `flexGrow` explicitly with `update_styles` and verify.
- Re-read live nodes before rewriting a section; the user edits copy directly on the canvas.

## Figma

- Variables in a collection with a light and a dark mode carry the color contract under one name per token; number variables carry spacing, radius and sizes. Set each variable's web code syntax to its CSS custom property name so inspection shows `var(--color-…)`.
- Shadows live in effect styles and typography in text styles, bound to variables where Figma allows.

## Pencil and others

Inspect the tool's variable and theme support, fill the capability map, and apply the mode and workaround rules above. A platform with no token store skips native tokens; its token board, with every value printed, becomes the delivery.
