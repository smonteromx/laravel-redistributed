# Color contract

The default contract when the user names none. Every value is oklch so lightness and chroma can be reasoned about directly. Names are CSS custom properties in Tailwind's `--color-*` namespace; implementation writes one value per mode under the same name.

## The four-role shape

Every color family that fills something carries four roles:

| Role | Token | Job |
| --- | --- | --- |
| base | `--color-{family}` | the solid fill |
| foreground | `--color-{family}-foreground` | text and icons on the fill |
| accent | `--color-{family}-accent` | the tinted surface of the family |
| accent-foreground | `--color-{family}-accent-foreground` | text on that tinted surface |

The shape is the one extension mechanism. When a family needs more range, it grows into these four roles before any new convention is invented; a `-strong`, `-hover` or `-subtle` token is a review flag.

## Base set

Always present, in both modes:

| Token | Job |
| --- | --- |
| `background` / `foreground` | page ground and running text |
| `card` / `card-foreground` | contained surfaces |
| `popover` / `popover-foreground` | floating surfaces |
| `muted` / `muted-foreground` | quiet surfaces (empty states, table heads, photo wells) and supporting text |
| `border` | separators and outlines; decorative, no contrast floor |
| `input` | field borders; 3:1 against every surface a field sits on |
| `ring` | focus indicator; 3:1 against every surface |
| `primary` / `primary-foreground` | the brand color and the main action; always present |
| `accent` / `accent-foreground` | interaction surface (row hover, active item, selected chip) |
| `secondary` / `secondary-foreground` | see below |
| `destructive` | see emphasis families |
| `chart-1` … `chart-5` | data series |
| `sidebar`, `-foreground`, `-primary`, `-primary-foreground`, `-accent`, `-accent-foreground`, `-border`, `-ring` | the navigation set |
| `--radius` | the corner base (see foundations) |

Aliases (`card-foreground` = `foreground`, `ring` = `primary`) are written as references (`var(--color-foreground)`), never copied values, so a change propagates.

## Decisions to put to the user (or decide for the product)

1. **`accent`: neutral or primary tint.** The stock contract makes `accent` a neutral grey that is hard to tell from `muted`. Making it the tinted surface of `primary` gives the brand tint a home and lets `primary` skip its own `-accent` pair. Recommend the tint unless the interface is deliberately monochrome.
2. **Brand colors beyond primary.** Ask whether a second, third or further brand color exists. A second brand color may occupy `secondary`, which then stops being a low-emphasis neutral: write its meaning down, give it the four roles, and send low-emphasis controls to outline or ghost styles. A third becomes `tertiary` with the same four roles. Each brand color carries a meaning; a color with no job stays out.
3. **Emphasis families.** Ask which feedback tones the product speaks: `affirmative` (success, confirmation), `informative` (neutral notice), `preventive` (warning, something pending), `destructive` (error, irreversible action), `interrogative` (the system asks for a decision), or others the product needs. Each gets the four roles. A family whose meaning coincides with a brand color may alias it (`affirmative` → `primary` and `accent`) instead of owning values. `destructive` is the stock name and stays.
4. **Charts.** Default: a data palette of its own, drawn from the same scene as the brand but carrying no semantic meaning, so an amber bar never reads as a warning. Alternative: bind the series to the emphasis bases, only when the data vocabulary genuinely is the semantic vocabulary. Ask, or decide and record why. Either way, a series is always labelled or textured, never told apart by color alone.
5. **Disabled.** Options, weakest to strongest: lowered opacity (fails contrast floors in both modes); the `muted` surface (collides with containers that are themselves `muted`, and with `accent` in dark); a dedicated `disabled` / `disabled-foreground` pair, separated from every surface by lightness rather than hue, its label at the full text floor. Recommend the dedicated pair whenever the product commits to an accessibility standard.
6. **Navigation set.** Own values when navigation is designed as its own surface; otherwise all eight alias the base set until it is.

## Rules the contract carries

- **One job per color.** Two roles that look alike but mean different things means one of them is wrong.
- **Interaction states are derived, not tokens.** Hover and pressed come from the base inside the component (a mix toward its foreground or a lightness step). Disabled is the one state that may own a pair.
- **Every fill takes its paired foreground.** White is never assumed: a light fill such as an amber carries a dark foreground, and foregrounds may invert between modes. An exception of this kind is authorised and recorded, not normalised away later.
- **Dark mode is re-derived, never inverted.** Pick each dark value by eye against the dark ground and verify it: brand fills usually rise in lightness, tinted surfaces drop, and surface order may flip (a dark `muted` sits above `card`, because dark surfaces separate by getting lighter).
- **Verified floors, both modes.** Declare the standard (for example WCAG 2.2 AA: 4.5:1 for text, 3:1 for `input`, `ring` and meaningful non-text) and measure every pair in both modes. APCA can serve as an internal second check on the dark ground. Touching one token means re-measuring every pair it belongs to.
- **Color never works alone.** Every distinction made with color also carries text, an icon or position.
