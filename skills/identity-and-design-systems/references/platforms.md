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
- `get_tokens` exports the store as CSS or as a Tailwind v4 `@theme` block, which is the delivery format implementation reads once sizes are converted back to rem.
- `set_tokens` with a new name rewrites every reference.
- The canvas resolves `1rem` as 12px, so every rem token draws at 75% (type, spacing and radius alike) and a rem container token is dropped. Store every size token in px, at the value a 16px root gives, and open its description with the rem implementation uses; then bind specimens, swatches and mocks to the tokens. The delivery board states that implementation takes the rem, converting the exported px at px ÷ 16.
- A rem or unitless line height turns into a rounded percentage of the font size (1.0556 at 72px draws 77px) and a `calc()` one collapses, so specimens draw line heights in px.
- A family token holds the family name alone (`Geist Mono`); a fallback stack in the value renders the system font, so the stack implementation ships goes in the description.
- A token whose value is a `calc()` collapses. Spacing steps the boards bind are their own px tokens (`--spacing-4`, half steps as `--spacing-1_5`), canvas-only: implementation derives every step from `--spacing`. A new step joins when a layout needs it, always as a multiple of the base.
- Inline `flex: 1` from `write_html` is sometimes dropped; set `flexGrow` explicitly with `update_styles` and verify.
- Re-read live nodes before rewriting a section; the user edits copy directly on the canvas.

## Figma

- Variables in a collection with a light and a dark mode carry the color contract under one name per token; number variables carry spacing, radius and sizes. Set each variable's web code syntax to its CSS custom property name so inspection shows `var(--color-…)`.
- Shadows live in effect styles and typography in text styles, bound to variables where Figma allows.

## Pencil and others

Inspect the tool's variable and theme support, fill the capability map, and apply the mode and workaround rules above. A platform with no token store skips native tokens; its token board, with every value printed, becomes the delivery.
