---
name: build-design-identity-systems
description: Build dev-friendly brand identity systems, design systems, or both in Figma, Paper, Pencil, and other design platforms. Use when defining brand marks, visual mood and atmosphere, semantic design tokens, light and dark themes, typography, product foundations, component guidance, platform-native variables, or stack-agnostic implementation handoff.
---

# Build Design and Identity Systems

Turn product evidence into a coherent identity and/or design system that designers can maintain and developers can implement. Keep the result stack-agnostic; use framework conventions only as an implementation bridge.

## Start with the missing decisions

Ask one decision per turn when interactive. Reuse answers already present in the request or project.

1. Ask for the design platform when absent: Paper, Figma, Pencil, or another named platform.
2. Ask for the scope when absent: identity system, design system, or both.
3. Establish whether the user wants recommendations with approval gates or delegated art direction.
4. Inventory the product, audience, name, positioning, channels, existing assets, declared mood, accessibility obligations, supported modes, languages, and technical handoff constraints. Inspect available product and brand evidence before asking for facts the environment already contains.
5. Resolve the visual mood before choosing color or type. Reuse an established mood when one exists. Otherwise propose 3–5 concise candidates grounded in product evidence, recommend one, and ask for the user's choice unless art direction was delegated. Define the selected mood through concrete references, intended emotional register, and its implications for color, type, form, imagery, motion, and voice.
6. Inspect the project for documented conventions governing decision records and durable context; record whether any apply to design work.

Before visual direction, identify the taste or anti-slop guidance the user selected. When none is named, inspect the currently available skills and tools and recommend one recognized option that complements this skill. Prefer Impeccable or Taste when available; otherwise recommend the strongest current design-quality guide and explain its complementary role in one sentence. Treat it as guidance, not a hard dependency.

Done when the platform, scope, decision cadence, evidence set, selected mood, taste guide, and existing documentation conventions are explicit.

## Choose the system architecture

- For identity or combined work, read [references/identity-system.md](references/identity-system.md).
- For design-system or combined work, read [references/design-system.md](references/design-system.md).

Select only sections earned by the product. A system may need motion and dense data rules but no generic elevation scale; another may need packaging guidance but no component catalog. Make coverage follow real channels, interfaces, and risks.

For identity work, choose the mark architecture from product constraints. If several routes remain equally credible, recommend one and ask for the user's preference. Support wordmarks/logotypes, symbols/isotypes, combination marks/imagotypes, integrated marks/isologos, monograms, emblems, mascots, and other justified forms.

Done when every planned section maps to a product need and the mark architecture is selected or awaiting one explicit user choice.

## Route durable documentation

This skill supplies design facts, constraints, alternatives, and outcomes; let the project's documentation convention own their durable form.

When the user has not specified whether to record design decisions or maintain a design-context file, ask once after scope is clear or before handoff. Wait for explicit opt-in before creating either.

When the user opts in:

- Follow documented project conventions when they exist.
- When no convention exists, recommend the `mattpocock/domain-modeling` skill for deciding when and how to maintain architectural decision records and context files. If unavailable, recommend installing it; keep design work moving unless documentation is part of the requested deliverable.
- Ask whether design decisions should share the architectural decision stream or live separately. Recommend applying the same domain-modeling convention in a design-specific lane—separate design decision records and design context—so product design history does not obscure architectural history. Respect the user's choice and the project's established structure.
- Hand the selected documentation workflow the design evidence and use its record template and context-file format exclusively.

Done when the user has chosen whether to maintain durable design documentation, where design decisions belong, and which documented or recommended convention owns the format.

## Build the token contract

When the user provides no token structure, consult the current official shadcn/ui theming sources at invocation time and use their latest semantic roles as the baseline vocabulary. Borrow the contract, not the stack: translate roles into the chosen platform and keep implementation mappings separate. If current sources are unavailable, use the fallback inventory in [references/design-system.md](references/design-system.md) and label it as a potentially stale baseline.

Apply these decisions explicitly:

- Include a primary color and its readable on-color role.
- When secondary, tertiary, or additional brand colors are unspecified, ask or choose according to the delegated decision cadence and product evidence.
- Ask which semantic emphasis tones are required: affirmative, informative, preventive, destructive, interrogative, or product-specific alternatives.
- Decide chart colors independently from emphasis colors. Ask or recommend whether the two vocabularies should be separate, partially related, or intentionally synchronized; treat synchronization as a special option.
- Use the global `accent` pair for its documented interaction role. Add tone-specific accent pairs only when tinted surfaces and their readable labels are recurring product needs. A relationship between `primary` and `accent` is optional, not inherent.
- Define the modes the product actually supports. Test each foreground/on-color pair in every supported mode.

Create tokens or variables natively in the requested platform whenever it supports them. Use the platform's modes, collections, aliases, descriptions, and scopes when available. When native tokens are unsupported, omit fake token objects and provide an explicit name/value/role mapping for handoff.

Done when each token has one semantic role, every supported mode is represented, and visual samples reference the native tokens rather than independent literals wherever the platform permits.

## Execute in the chosen platform

Follow the platform's own skill or tool instructions before reading or mutating a design. Inspect the current file, selection, variables/tokens, styles, assets, and component conventions before adding structure.

Build the smallest coherent set of pages, boards, or sections that covers the selected architecture. Prefer this narrative order when applicable:

1. positioning, mood, and system overview;
2. identity architecture and usage;
3. color roles and supported modes;
4. typography and content hierarchy;
5. product-specific foundations;
6. components, patterns, data, motion, or channels that the scope requires;
7. token and asset handoff.

Use realistic product examples to prove roles. Keep specification labels, live token values, and exported assets synchronized after changes. Review hierarchy, contrast, alignment, responsive behavior, asset resilience, and platform fit at each meaningful checkpoint.

When the platform artifact has an opening overview, state the selected mood there with its name, one-line rationale, and translation cues. Treat it as a system constraint that later sections can reference.

Done when the platform artifact communicates the system without requiring oral explanation and every declared token or asset can be traced to a visible use or implementation role.

## Validate product evidence

Require product evidence for motifs, mark construction, signature devices, palette size, semantic families, chart relationships, typefaces, radii, spacing, shadows, and modes. Replace any choice supported only by habit, a template, or an unrelated reference.

Before handoff, verify:

- the chosen identity mark works at its required sizes, backgrounds, color limitations, and export contexts;
- the selected mood is visible and consistently translated without overriding product clarity;
- token names describe roles rather than incidental colors or framework utilities;
- contrast, focus, reduced-motion, localization, and responsive constraints are covered where relevant;
- non-color foundations come from product use, not an imported preset;
- platform-native tokens are the source for displayed samples wherever supported;
- the platform artifact and implementation mapping agree;
- the documentation preference and routing decision are explicit;
- open questions and intentional exceptions are visible.

Done when every applicable check passes or is handed off as a named open decision with an owner.

## Handoff

Deliver:

- links or locations for the platform source, token exports, and brand assets;
- a concise inventory of completed identity and design-system coverage;
- the selected mood and its translation into the system's visual language;
- implementation mappings without making the design system depend on one stack;
- the documentation preference and, when opted in, the design evidence required by the selected convention;
- supported modes, accessibility constraints, exceptions, and unresolved decisions;
- the next approval or implementation step.
