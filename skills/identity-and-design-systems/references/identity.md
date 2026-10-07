# Identity

## Mark architecture

Choose the architecture before drawing. Each fits a different product; pick the one that fits this product and say why, or put the two strongest candidates to the user.

| Architecture | What it is | Fits when |
| --- | --- | --- |
| Symbol + wordmark, separable (isotype + logotype) | A symbol and a wordmark that work together or alone | the symbol must stand alone small (app icon, avatar, favicon) and the name must stand alone in text headers |
| Imagotype | Symbol and wordmark fixed side by side or stacked as one lockup | the pair is always seen together; the symbol carries little on its own |
| Isologo | Symbol and name fused, the name inside or part of the drawing | emblematic brands (crests, seals, badges, labels); weak at small sizes |
| Wordmark only | The name, typographically treated | a distinctive, pronounceable name; text-heavy contexts |
| Lettermark / monogram | Initials or a single letter | long names, acronyms, institutional registers |
| Emblem | A contained badge shape | heritage, certification, physical goods |
| Mascot | A character, often beside another mark | consumer and community products where personality carries the brand; needs a pose and expression system |
| Dynamic mark | A mark with rule-based variations | brands that span many sub-products or events |

Whatever the architecture, the symbol says one idea specific to the product (what it does, or the one thing it does that its category does not), and the construction protects that idea. A generic drawing of the category is the failure to avoid.

## Construction board

- The geometry: axis, grid, the measured relationships that make it recognisable, numbered and explained.
- What is load-bearing: which property must never change (an asymmetry, a proportion, the color assignment), with a sentence on what breaks if it does.
- Color assignment: which token each part takes. Marks bind to the system's tokens, never to hand-picked values.
- Clearspace, as a unit taken from the mark itself.
- Minimum size, and the fallback below it (a simplified mark, a solid shape, a thicker stroke).

## Variants

Each variant with when to use it:

- Full color on the light ground and on the dark ground (dark values come from the dark-mode tokens).
- One ink, for small sizes, print and embroidery.
- Reversed, on the primary color or on a photo.
- Badge: the symbol on a filled square for app icon, favicon and avatar. A legibility exception here (a color that turns muddy at 16 px) is allowed, documented, and kept out of the token contract.
- Render recipes, when the mark depends on blending or transparency: one per ground (light, dark, unknown) and a portable flat version for export.

## Misuse

Show concrete misuse beside its reason: recoloring, symmetry or distortion that breaks the idea, insufficient clearspace, recomposing the wordmark in another typeface.

## Name and voice

- The name's textual form (running text, URLs, accessible text) and its mark form when they differ (a ligature, a special glyph, a case treatment), with the rule for where each appears.
- Pronunciation, expansion and canonical descriptor when the name needs them.
- Tagline and its register; product vocabulary: the words copy always uses and the ones it avoids.
- Before publishing, a trademark search and a check on domain and handle availability.

## Asset inventory

The production artwork, each in the variants above, as vectors: symbol, wordmark, lockups, custom glyphs, app icon and favicon set, social cover, and any medium with its own constraints (email: no brand fonts, no SVG, images blocked by default; print: CMYK or spot values). An inventory board lists every file and where it is used.
