# Frontend Conventions

Project-specific frontend rules for Inertia, React, shadcn/ui, Tailwind, and the app feedback system.

All names below prefixed with `Example` are sample placeholders; replace them with the feature's real domain names.

These conventions reference project-provided defaults such as `useFlashToast`, `useAppearance`, `useDecorator`, `EmphasisVariant` / `emphasis-variant`, `<Toaster />`, `<FlashAlert />`, and `<IconRenderer />`. These defaults are distributed as items of the `smonteromx/laravel-redistributed` shadcn registry. If a referenced default is missing from the project, install its item (confirm with the user first) instead of reimplementing it:

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/{item}
```

| Missing default | Registry item |
| --- | --- |
| `<FlashAlert />`, `useFlashToast`, `FlashResponse` type, `EmphasisVariant` mirror and decoration | `feedback-react` |
| `useAppearance`, `HandleAppearance` | `appearance-react` |
| `Decoration` type, `useDecorator` | `decorator-react` |
| `<IconRenderer />` | `icon-renderer-react` |
| Emphasis CSS tokens (`--{variant}`, `-foreground`, `-accent`, `-accent-foreground`) | `emphasis-css` |

## Inertia Feedback

Backend flash feedback is sent with `Inertia::notify()`.

```php
Inertia::notify(string $message, FlashResponse $style, EmphasisVariant $variant = EmphasisVariant::AFFIRMATIVE);
```

Frontend receivers:
- `<FlashAlert />` renders persistent `flash.alert` messages.
- `useFlashToast()` fires `flash.toast` toasts through sonner. It is already called inside the `<Toaster />` component, so do not wire extra listeners in layouts or pages.
- `<Toaster />` is the sonner/shadcn toast provider, configured with emphasis-variant styling via `useAppearance` and the emphasis CSS tokens. Mount it exactly once in the app entry (`resources/js/app.tsx`), not in layouts.
- Place `<FlashAlert />` near the relevant form or action area, usually above the main form, and avoid stretching it across unrelated page or section width.

Shared props are typed in `resources/js/types/global.d.ts`, and flash channels are typed there through the `flashDataType` key of the Inertia config module declaration, using the `FlashResponse` type from `resources/js/types/data/flash-response.ts`. Update this file when adding shared props or flash channels.

## Enums

Frontend enums mirror backend enums as a const map plus a value type.

Rules:
- Enums live under `resources/js/enums/{domain}/{subdomain}/`, mirroring the backend enum domain and subdomain.
- Cross-cutting enums that belong to no domain live at the enum root, mirroring the backend. `EmphasisVariant` is `resources/js/enums/emphasis-variant.ts`, not under a domain or a `frontend/` subfolder.
- Each enum file exports a plural `const` object holding the keys and values, and a singular `type` that admits the const's values.
- Const keys mirror the backend enum case names, so they keep the backend casing (such as `DRAFT` for a backend `DRAFT` case).
- Use the `const` for runtime comparisons and object keys; use the `type` for props, parameters, and form state.

```ts
// resources/js/enums/{domain}/{subdomain}/example-status.ts
export const ExampleStatuses = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
} as const;

export type ExampleStatus = (typeof ExampleStatuses)[keyof typeof ExampleStatuses];
```

## Enum Decoration Pattern

UI metadata for enums should be resolved through decoration records and `useDecorator()` instead of duplicating labels, icons, descriptions, or color decisions inline.

Rules:
- Import enum constants and types from `@/enums/{domain}/{subdomain}/...` for runtime comparisons, object keys, props, and form state.
- Use `useDecorator()` with a decoration record when an enum needs presentation metadata.
- Decorations live under `resources/js/decorations/{domain}/{subdomain}/`, mirroring the enum path, with exactly one decoration per file.
- Treat a decoration as a simple enum-keyed map plus only the extra metadata keys that UI actually consumes.
- Type a decoration record with only the metadata keys it uses via `Pick<Decoration, ...>` or `Omit<Decoration, ...>`; do not force a record to declare unused `Decoration` fields.
- Keep the shared `Decoration` type in `resources/js/types/ui/decoration.ts`; do not add shared option-builder utilities or files such as `decoration-options.ts`.
- Use `useDecorator()` directly wherever options, labels, icons, descriptions, colors, or any extra decorations are needed.
- Put style variants in reusable components and select them through decoration values instead of embedding styling logic in decoration utilities.
- If styling depends on a decoration key, extend the target component with a variant named after that key and reuse the variant; do not create local maps from decoration keys to CSS classes.
- `useDecorator()` is not specific to `EmphasisVariant`; use it for any enum that needs labels, icons, colors, descriptions, or other UI metadata.
- Extend the shared `Decoration` type on demand when a decoration record needs a new metadata field.

```ts
// resources/js/decorations/{domain}/{subdomain}/example-status-decoration.ts
import { ExampleStatuses, type ExampleStatus } from '@/enums/{domain}/{subdomain}/example-status';
import type { Decoration } from '@/types/ui/decoration';

// Pick only the metadata keys this decoration actually uses.
export const ExampleStatusDecoration: Record<ExampleStatus, Pick<Decoration, 'label'>> = {
    [ExampleStatuses.DRAFT]: { label: 'Draft' },
    [ExampleStatuses.PUBLISHED]: { label: 'Published' },
    [ExampleStatuses.ARCHIVED]: { label: 'Archived' },
};
```

`App\Enums\EmphasisVariant` is the semantic color enum used by feedback and emphasis UI, mirrored on the frontend at `resources/js/enums/emphasis-variant.ts`. Keep its CSS tokens in `resources/css/app.css` as `--{variant}`, `--{variant}-foreground`, `--{variant}-accent`, and `--{variant}-accent-foreground`, following shadcn semantics: base for backgrounds, foreground for text on base, accent for subtle backgrounds, and accent-foreground for text on subtle backgrounds. Define values in `oklch`, as shadcn's default `destructive` does.

## Icon Rendering

Icons that arrive as data — from decorations, hooks, props, or models — are rendered with `<IconRenderer />` instead of being aliased to a local component variable.

Rules:
- Use `<IconRenderer iconNode={icon} />` whenever the icon is a component reference coming from data, such as `useDecorator()` results.
- Avoid the `const Icon = decoration.icon` (or destructure-rename `icon: Icon`) pattern; it adds noise and collides with icon-library exports named `Icon`.
- `<IconRenderer />` lives at `resources/js/components/ux/typography/icon-renderer.tsx`, forwards `className` and aria attributes, and renders nothing when the reference is empty.

```tsx
const decorator = useDecorator(ExampleStatusDecoration, status);

return <IconRenderer iconNode={decorator.icon} className="size-4" />;
```

## Forms

Rules:
- Prefer Inertia's `<Form>` component over the `useForm` hook; reach for `useForm` only when you need imperative control the component cannot express.
- Type both `<Form>` and `useForm` with a dedicated `{Case}Form` interface that describes the form fields, such as `CreateExampleForm`.
- Keep the `{Case}Form` interface local to its page or component; promote it to the `resources/js/types/` structure only when it is reused in more than one place.
- Prefer shadcn/ui `<Field>` compositions over bare `<Input>` elements so labels, descriptions, and validation messages stay consistent across forms.

## Appearance

`useAppearance()` manages light, dark, and system themes.

Rules:
- Persist appearance to `localStorage` and cookie through the existing hook.
- Keep server-side theme handling in `HandleAppearance` middleware.
- Test important UI in light and dark modes when adding visible stateful components.

## Components

Rules:
- shadcn/ui primitives live in `resources/js/components/ui/`.
- Check existing shadcn/ui components before creating custom UI.
- Do not edit shadcn primitives unless extending variants intentionally.
- Custom reusable composition components live in `resources/js/components/ux/`, organized internally by frontend classification (such as `ux/{classification}/`).
- Domain-specific components live in `resources/js/components/domain/{domain}/{subdomain}/` when the domain has subdomains.
- Inertia pages live under `resources/js/pages/{domain}/{subdomain}/` or `resources/js/pages/static/` for static pages.
- Do not add barrel `index.ts` or `index.tsx` export files; import concrete files directly.
- Avoid monolithic components that would be described as `lg`, `xl`, or `xxl`; compose smaller focused components instead.

## Resources JS Structure

Rules:
- `pages`, `models`, `enums`, and `decorations` mirror the backend domain structure directly. Every other non-page folder under `resources/js/` is organized by context first (such as `ui`, `ux`, or another concrete concern not tied to a domain), with an internal `domain/` folder when it needs domain-specific code.
- `pages` live under `resources/js/pages/{domain}/{subdomain}/` or `resources/js/pages/static/`.
- `models` live under `resources/js/models/{domain}/` (by domain only, mirroring `app/Models/{Domain}/`).
- `enums` live under `resources/js/enums/{domain}/{subdomain}/` (or the enum root for cross-cutting enums), mirroring the backend enum namespaces.
- `decorations` live under `resources/js/decorations/{domain}/{subdomain}/`, mirroring the enum paths.
- `ux` composition components live under `resources/js/components/ux/{classification}/`, organized by frontend classification.
- `types` live under `resources/js/types/`, organized by frontend classification (such as `ui`, `form`, `data`), with a `types/domain/{domain}/{subdomain}/` subfolder for domain-specific types, the same way `components` nests its `domain/` folder.
- Prefer keeping a type local to the page or component that uses it; promote it to `resources/js/types/` only when it is reused in more than one place.
- Reusable shared props and flash data stay typed in `resources/js/types/global.d.ts`.
- For any `resources/js/` folder not covered here, ask for the preferred structure before creating it.

## Layouts

Rules:
- Prefer Inertia persistent layouts; assign them per page (or through a shared layout module) so they survive visits and keep component state.
- Do not push everything into `AppShell`. Different scopes may need different — or nested — layouts.
- Compose nested layouts when a section needs its own chrome on top of a base layout.
- Keep page-specific layout code small and push reusable shell behavior into the appropriate shared layout.

## Tailwind And Styling

Rules:
- Tailwind v4 is configured through `resources/css/app.css`.
- Preserve existing design-system tokens before adding new colors or spacing scales.
- Prefer shadcn component variants, existing size variants, semantic CSS variables, and Tailwind theme tokens over one-off fixed value classes.
- Avoid local fixed size utilities such as `h-10`, `w-10`, and arbitrary value classes like `h-[10px]` unless no existing component variant or token fits.
- Prefer semantic emphasis variants over one-off destructive/success colors.
- Ensure frontend changes work on desktop and mobile.
