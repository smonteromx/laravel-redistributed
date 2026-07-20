# Design Guidelines

Project-specific rules for design work in and out of code: component patterns, designing in Paper through its MCP connector, and the pipeline every screen-producing task must follow.

## Design In Code

Rules:
- Detect the component pattern the codebase already uses — compound components, configuration pattern, composition pattern, `asChild` composition, or any other — and prioritize that detected pattern; do not introduce a competing pattern for the same kind of component.
- When a structure is used in more than one place, decouple it into a real component; do not keep copy-pasted markup blocks in sync by hand.
- When a variation of an existing component is used in more than one place, declare the variant internally in the already existing component; never duplicate the component just to change or add one line, prop, or class.
- Prioritize layouts, hooks, and shared composition utilities to keep a clean frontend structure; pages stay thin and declarative.

## Design In Paper

Paper is the design tool, reached through its MCP connector.

Rules:
- On the first Paper interaction of a session, understand the available capabilities through the connector before designing: read the Paper guide and use its context tools (basic info, tokens, fonts, selection) to learn what the file offers.
- Use design tokens anywhere they are reliable. When implementing, translate the tokens and their usages properly into the code design system — not everything needs a literal 1:1 conversion.
- If no design system exists in the file, create one before designing screens. If anything the task needs is missing from the design system, complement the design system instead of inlining one-off values.
- Paper allows the user to generate images and vectors, but the connector does not expose that generation to the agent (the agent can only author inline SVG). When a generated image or vector is needed, ask the user to create it in Paper.
- Use simple Spanish names/titles for top-level frames only. This is a Paper-usage convention for canvas organization, not part of the design content itself.
- Always check for bounding troubles — internals must not trespass frame boundaries, and content must not clip at artboard edges — before considering a design done.
- Requested screens are always hi-fi unless a low-fi version or mockup is explicitly requested.
- Always include the mobile variation of every requested screen; do not ask for confirmation on this. If any other intermediate screen size (media query breakpoint) needs adjustments that were not designed, add notes describing them — or ask for confirmation to design that intermediate size when the adjustments are too much to be described only.

## Screen Pipeline

Every task that needs a screen passes through this pipeline:

1. **Design out of code** in Paper via the MCP connector. Depending on the task nature, a single design may be enough, or several iterations for the same need may have to be proposed.
2. **Deliberate and sign off** a final version. Iterate until the result convinces both the user and the agent.
3. **Implement** the signed-off design in code, following the Design In Code rules and the frontend conventions.
4. **Review** the result using the available browser tools, regularly comparing against the design in Paper. Apply criterion on how it looks; do not deliver half-done or cheesy implementations.
5. **Deliver** the implementation.
