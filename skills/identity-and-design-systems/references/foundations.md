# Foundations

Everything that is neither color nor a mark. A foundation enters the system only when the product uses it: an editorial site may need measure and containers but no elevation scale; a dense console may need control heights; a brand for print may need a type scale and a grid and nothing else. A board that lists what is absent ("nothing else exists because nothing needs it yet") is part of the system.

## Derivation

- **Values come from the product, never from a preset.** Derive each scale from the screens or applications the companion produces (or audits): find the values the product actually uses, canonise the strong ones, snap the stray ones. A scale copied from a framework default is a placeholder until this audit replaces it.
- **Tailwind namespaces and step names.** `--spacing`, `--radius-*`, `--text-*`, `--font-*`, `--font-weight-*`, `--tracking-*`, `--leading-*`, `--shadow-*`, `--ease-*`, `--breakpoint-*`, `--container-*`, and Tailwind's own step names (`--tracking-tight`, not `--tracking-heading`). A name outside the namespaces is a custom addition with a stated job (`--container-reading`, `--shadow-float`, `--duration-enter`).
- **Overridable bases.** Each scale derives from one base where it can: `--spacing` multiplies every step; `--radius` yields the radius steps through `calc()`; each `--text-*` size carries its own line-height, letter-spacing and weight pairs. Moving a base is a system change, which is the point.
- **Unused defaults switched off** (`--color-*: initial`, `--shadow-*: initial`, …) when the product wants its restraint to be a fact rather than a hope. Offer it; it is optional.
- **Units.** Sizes (text, radius, spacing) in rem; tracking in em; leading unitless; shadow offsets in px. When the canvas previews rem poorly, the canvas mirrors the values in px and the conversion is exact.
- **The base step is marked.** On the board, each scale's base or default step carries the primary color, so the eye finds it first.

## Typography

- **Families with jobs.** Usually a display face, a text face and a mono face; a serif only when it has a job (editorial accent). Each family gets a written job and a weight range; when text wants more weight than its family's ceiling, it moves to the next family instead of forcing it.
- **The scale.** Each step lists its size, its pairs (leading, tracking, weight) and where it is used. Leading follows the job, not the size: a prose size may carry looser leading than the step above it.
- **Display floor.** The smallest size the display face is allowed at, chosen so a title never sits at the same size as body prose.
- **Numerals.** Tabular figures for numbers set inside text; mono for elements that are only data.
- **Languages.** When the product ships in more than one language, widths are budgeted on the longest one and no label truncates without keeping its full text accessible.
- **The wordmark is artwork.** Its tracking and weight sit outside the scale.

## Spacing

One base multiplier and only the steps the product uses, each with a job (between a label and its value, card padding, between sections). State the granularity (whole or half steps) and the key rhythms (label to control, field to field, card padding).

## Radius

One base and derived steps, each step mapped to the components that use it (chips, fields, buttons, cards, sheets, pills). Radii grow with the container. Nothing takes a radius outside the scale.

## Elevation

Choose the model first:

- **Border-led**: surfaces at rest are flat (1 px outline), with one shadow reserved for what truly floats (menu, sheet, toast).
- **Scaled**: a named ladder (`2xs` … `2xl` plus a bare base), anchored on the shadows the product really uses.

Shadows are tinted from the scene's ink, never neutral black. Light and dark share geometry and differ only in color and alpha: the dark ink runs near-black at a markedly higher alpha, and dark elevation leans first on the lighter surface. Where the platform has no shadow token, the scale lives on the board as swatches plus one canonical CSS block per mode.

## Outline and focus

Border widths with jobs (resting line, emphasis border) and the focus indicator: width, offset, color from `ring`. Focus is visible for mouse, keyboard and voice alike.

## Motion

Only when the product moves things: a few named durations with jobs (tap, enter, a signature transition), named easing curves, how entering surfaces appear (from what scale and opacity, from which origin), and the reduced-motion policy: what is removed, what replaces it (an opacity fade, so nothing pops in), and what keeps running. Exit is faster than entry; repeated, high-frequency actions do not animate.

## Icons

Ask which family to use when the user has not said. Recommend one with first-class packages across component ecosystems: **Lucide**, **Tabler**, **Hugeicons**, **Phosphor**, **Remix**, matching stroke weight and register to the direction. Then fix:

- One family, one style. A toggled state (saved, active) is the same glyph filled, never a second set.
- The stroke width, chosen to weigh the same as the borders beside it, and the allowed sizes, each tied to the text size it sits next to.
- Icons inherit the color of their text; a fixed icon color is a review flag.
- An icon beside text keeps a fixed gap; an icon without text carries an accessible name.
- When the family lacks a drawing for a concept the product names, a custom glyph is drawn to the family's own grid, stroke and caps, and named after the domain concept. The brand mark is not an icon and never enters a button.

## Layout and touch

Breakpoints and containers the product uses, and the hit-target minimum, separated from drawn size (a 16 px icon can accept a 44 px finger).
