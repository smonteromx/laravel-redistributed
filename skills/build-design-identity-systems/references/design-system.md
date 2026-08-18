# Design system branch

Read this reference when the scope includes a design system.

## Start from product behavior

Inventory the product surfaces, tasks, data density, input methods, breakpoints, content types, navigation models, supported modes, accessibility obligations, and delivery channels. Audit existing screens or code when available; distinguish recurring behavior from exploratory accidents.

Choose foundations from that inventory. Do not force a generic checklist into every system.

| Foundation | Include when the product needs it |
| --- | --- |
| Color and modes | Always; define semantic roles and readable foregrounds |
| Typography | The product renders text; cover hierarchy, language, numerals, and fallbacks |
| Spacing and density | Repeated layouts or controls need a shared rhythm |
| Shape and borders | Controls, cards, containers, or brand expression require consistent form |
| Elevation | Overlays or layered surfaces need a depth model; flat systems may use borders only |
| Focus and interaction | Interactive products need visible state and input-modality rules |
| Motion | Transitions communicate state or brand; include reduced-motion behavior |
| Grid, containers, breakpoints | Responsive composition needs shared layout constraints |
| Iconography and imagery | Repeated visual language or asset production needs rules |
| Data visualization | Charts, maps, or dense quantitative displays need a separate contract |
| Content and localization | Voice, error copy, long strings, pluralization, or RTL affect components |

Done when each included foundation answers a recurring product need and omitted foundations are genuinely out of scope.

## Translate mood into product behavior

When the design system extends an identity, inherit its selected mood. For design-system-only work, use the mood resolved in `SKILL.md`.

Translate the mood through the foundations the product actually uses: palette temperature and intensity, typographic contrast, shape, imagery, motion, density, and voice. Let accessibility, task clarity, localization, and interaction requirements set the functional bounds.

Done when the interface carries a recognizable atmosphere while equivalent controls remain predictable across contexts and modes.

## Use the current shadcn semantic contract as a fallback

When no token structure is specified, inspect the latest official [shadcn/ui Theming documentation](https://ui.shadcn.com/docs/theming) and official theme/create output at invocation time. Record the source and access date. Use names and semantic pair conventions as a practical baseline, never as a technology requirement or a source of visual values.

The fallback inventory, current at skill authoring time, is:

- surfaces and content: `background`/`foreground`, `card`/`card-foreground`, `popover`/`popover-foreground`;
- action and interaction: `primary`/`primary-foreground`, `secondary`/`secondary-foreground`, `muted`/`muted-foreground`, `accent`/`accent-foreground`, `destructive`, `ring`;
- structure: `border`, `input`, base `radius` and its derived scale;
- data: `chart-1` through `chart-5`;
- navigation when applicable: `sidebar`/`sidebar-foreground`, `sidebar-primary`/`sidebar-primary-foreground`, `sidebar-accent`/`sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`.

Reconcile this list with the live official contract before creating tokens. Preserve current official roles, add only recurring product semantics, and document deliberate removals or renames.

## Extend color semantics deliberately

- Always create a primary role and readable foreground/on-primary role.
- Decide whether secondary and tertiary brand roles are needed; low-emphasis UI can often use `muted` or `accent` instead of another brand color.
- Ask which emphasis tones the product needs: affirmative, informative, preventive, destructive, interrogative, or domain-specific tones.
- Start custom semantic tones with the pair convention `{tone}` / `{tone}-foreground`. Add `{tone}-accent` / `{tone}-accent-foreground` only when recurring tinted surfaces need their own accessible pair.
- Treat the global `accent` pair as an interaction surface unless the product explicitly assigns another role. Its relationship to `primary` is a design decision.
- Design chart roles from the data model: categorical, sequential, diverging, status, or brand-led. Decide separately whether chart colors share, reference, or avoid semantic emphasis colors.

Name roles by intent rather than hue. Test every foreground pair and non-text state cue in every supported mode. Preserve meaning through text, icon, pattern, or position where color alone would fail.

Done when each color has one stated job, recurring needs have roles, and visual similarity does not create accidental semantic coupling.

## Represent tokens in the chosen platform

Prefer native primitives:

- **Figma:** variables, collections, modes, aliases, scopes, styles, components, and component properties.
- **Paper:** design tokens, token references in samples, named artboards, and explicit literals only where the platform cannot model a token type or mode.
- **Pencil or another platform:** inspect current variable/style/component support and use its native equivalent.

Model primitive, semantic, and component layers only when each layer reduces real duplication. Keep a single source of truth for a value. Avoid alias layers that merely rename the same role.

If the platform cannot model a token type, show its canonical value and usage in the platform artifact and provide a structured export or mapping beside it. Do not imply unsupported token linkage.

Done when a designer can change a native token once and all supported samples update, or every unavoidable manual sync point is explicitly listed.

## Prove developer usability

For each major role, show:

- canonical token name and supported modes;
- a realistic usage example and a misuse boundary;
- implementation-neutral meaning;
- optional mappings for the target stack;
- accessibility and responsive constraints;
- ownership and change process.

Validate the system against at least one dense interface, one empty/error/loading state family, one narrow viewport or constrained surface, and the product's highest-risk workflow when those surfaces exist.

Done when implementation can proceed without sampling colors, measuring screenshots, or inventing missing states.
