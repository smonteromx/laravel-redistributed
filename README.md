# laravel-redistributed

A [shadcn registry](https://ui.shadcn.com/docs/registry) that distributes opinionated project defaults for Laravel applications: AI guidelines, feedback primitives, enums, hooks, and other conventions-backed building blocks.

This repository is the registry itself — items install directly from GitHub with the `shadcn` CLI. No registry server, no build step.

## Usage

Install an item into your Laravel project:

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/<item>
```

## Structure

The backend is always Laravel, with `-inertia` / `-livewire` suffixes when an item is specific to one approach. Frontend items are grouped by technology, so stacks never mix:

```txt
registry/
├── guidelines/   Cross-stack AI guidelines
├── laravel/      Backend items (Laravel-only, plus -inertia / -livewire variants)
├── react/        React frontend items
└── vue/          Vue frontend items
```

Inside each item folder, files mirror their install path in the consuming project.

## Items

| Item | Stack | Description | Installs to |
| --- | --- | --- | --- |
| `guidelines` | Cross-stack | Laravel Boost AI guidelines: project architecture, backend and frontend conventions, testing, and quality pipelines. | `.ai/guidelines/` |
| `feedback-inertia` | Laravel (Inertia) | Backend flash feedback: `Inertia::notify()` macro, `FlashResponse` and `EmphasisVariant` enums, and `AppException`. | `app/` |
| `appearance-react` | Laravel + React | Light/dark/system theme handling: `HandleAppearance` middleware and the `useAppearance` hook. | `app/`, `resources/js/` |
| `feedback-react` | React | Frontend flash feedback: `EmphasisVariant` mirror, `FlashResponse` type, emphasis decoration, `useFlashToast()`, and `FlashAlert`. | `resources/js/` |
| `emphasis-css` | CSS | Semantic emphasis color tokens (base / foreground / accent / accent-foreground per variant) in oklch, light and dark. | CSS file |
| `decorator-react` | React | Enum decoration pattern: `Decoration` type and `useDecorator()` hook. | `resources/js/` |
| `icon-renderer-react` | React | `IconRenderer` component for icon references coming from data. | `resources/js/` |

### guidelines

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/guidelines
```

The guidelines are [Laravel Boost](https://github.com/laravel/boost) sources. After installing, regenerate your agent context files:

```bash
php artisan boost:update
```

### feedback-inertia

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/feedback-inertia
```

Backend half of the app feedback mechanism for Inertia apps:

- `App\Macros\InertiaNotifyMacro` — registers `Inertia::notify(string $message, FlashResponse $style, EmphasisVariant $variant)` to flash `alert` or `toast` payloads.
- `App\Enums\FlashResponse` — `ALERT` (persistent inline) and `TOAST` (transient) channels.
- `App\Enums\EmphasisVariant` — semantic emphasis palette (`affirmative`, `informative`, `preventive`, `destructive`, `interrogative`).
- `App\Exceptions\AppException` — base exception for expected domain failures; renders by flashing feedback and redirecting back.

After installing, declare the macro yourself in `AppServiceProvider::boot()`:

```php
use App\Macros\InertiaNotifyMacro;

public function boot(): void
{
    InertiaNotifyMacro::declare();
}
```

The frontend counterparts (toaster, callout, transient listener) ship as separate per-technology items.

### appearance-react

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/appearance-react
```

Light, dark, and system theme handling across the stack:

- `App\Http\Middleware\HandleAppearance` — shares the `appearance` cookie with views server-side, so the initial render matches the user's theme.
- `useAppearance()` (`resources/js/hooks/use-appearance.ts`) — React hook exposing `appearance`, `resolvedAppearance`, and `updateAppearance()`; persists to `localStorage` and cookie, applies the `dark` class, and reacts to system theme changes. Also exports `initializeTheme()` to apply the stored theme at app boot.
- `Appearance` / `ResolvedAppearance` types (`resources/js/types/ui/appearance.ts`).

After installing, register the middleware yourself in `bootstrap/app.php`, inside the `web` group of `withMiddleware()`:

```php
use App\Http\Middleware\HandleAppearance;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
        HandleAppearance::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);
})
```

### feedback-react

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/feedback-react
```

Frontend half of the app feedback mechanism, pairing with `feedback-inertia`:

- `EmphasisVariants` / `EmphasisVariant` (`resources/js/enums/emphasis-variant.ts`) — frontend mirror of the backend enum, plus the `EmphasisVariantAlternative` mapping type for sonner.
- `FlashResponse` type (`resources/js/types/data/flash-response.ts`) — shape of a flash payload (`variant`, `message`).
- `EmphasisVariantDecoration` (`resources/js/decorations/emphasis-variant-decoration.ts`) — per-variant lucide icons.
- `useFlashToast()` (`resources/js/hooks/use-flash-toast.ts`) — listens to Inertia `flash` events and fires sonner toasts for the `toast` channel.
- `<FlashAlert />` (`resources/js/components/ux/messages/flash-alert.tsx`) — renders the persistent `alert` channel using the shadcn `Alert` with emphasis variants.

It pulls `sonner` and `alert` from shadcn, and `emphasis-css`, `decorator-react`, `icon-renderer-react`, and `appearance-react` from this registry as dependencies.

After installing, wire up three things yourself:

**1. Adapt `resources/js/components/ui/sonner.tsx`** — replace the `next-themes` usage with `useAppearance` from this registry, call `useFlashToast()`, and map the emphasis tokens into sonner's style variables:

```tsx
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';

const Toaster = ({ ...props }: ToasterProps) => {
    const { appearance = 'system' } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance as ToasterProps['theme']}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                    '--success-bg': 'var(--affirmative-accent)',
                    '--success-border': 'var(--affirmative)',
                    '--success-text': 'var(--affirmative-accent-foreground)',
                    '--info-bg': 'var(--informative-accent)',
                    '--info-border': 'var(--informative)',
                    '--info-text': 'var(--informative-accent-foreground)',
                    '--warning-bg': 'var(--preventive-accent)',
                    '--warning-border': 'var(--preventive)',
                    '--warning-text': 'var(--preventive-accent-foreground)',
                    '--error-bg': 'var(--destructive-accent)',
                    '--error-border': 'var(--destructive)',
                    '--error-text': 'var(--destructive-accent-foreground)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'cn-toast',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
```

You can then drop the `next-themes` package if nothing else uses it.

**2. Add emphasis variants to `resources/js/components/ui/alert.tsx`** — extend `alertVariants` with one variant per emphasis token:

```tsx
variants: {
    variant: {
        default: 'bg-card text-card-foreground',
        affirmative:
            'bg-affirmative-accent text-affirmative-accent-foreground *:data-[slot=alert-description]:text-affirmative-accent-foreground [&>svg]:text-current border-affirmative',
        informative:
            'bg-informative-accent text-informative-accent-foreground *:data-[slot=alert-description]:text-informative-accent-foreground [&>svg]:text-current border-informative',
        preventive:
            'bg-preventive-accent text-preventive-accent-foreground *:data-[slot=alert-description]:text-preventive-accent-foreground [&>svg]:text-current border-preventive',
        destructive:
            'bg-destructive-accent text-destructive-accent-foreground *:data-[slot=alert-description]:text-destructive-accent-foreground [&>svg]:text-current border-destructive',
        interrogative:
            'bg-interrogative-accent text-interrogative-accent-foreground *:data-[slot=alert-description]:text-interrogative-accent-foreground [&>svg]:text-current border-interrogative',
    },
},
```

**3. Type the flash channels in `resources/js/types/global.d.ts`** — add `flashDataType` to the Inertia config module declaration:

```ts
import type { FlashResponse } from '@/types/data/flash-response';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        // ...
        flashDataType: {
            alert?: FlashResponse;
            toast?: FlashResponse;
        };
    }
}
```

Finally, mount `<Toaster />` exactly once in your app entry (`resources/js/app.tsx`). `useFlashToast()` is already called inside it, so no extra listener wiring is needed.

### emphasis-css

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/emphasis-css
```

Adds the `EmphasisVariant` color tokens to your CSS file for `affirmative`, `informative`, `preventive`, `destructive`, and `interrogative`, in light and dark modes, following shadcn semantics: `--{variant}` for backgrounds, `--{variant}-foreground` for text on base, `--{variant}-accent` for subtle backgrounds, and `--{variant}-accent-foreground` for text on subtle backgrounds. Values are oklch, built from the same Tailwind scale as shadcn's default `destructive` (which the item deliberately does not override).

### decorator-react

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/decorator-react
```

The enum decoration pattern: the shared `Decoration` type (`resources/js/types/ui/decoration.ts`) and the `useDecorator()` hook (`resources/js/hooks/use-decorator.ts`) to resolve UI metadata from enum-keyed decoration records.

### icon-renderer-react

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/icon-renderer-react
```

`<IconRenderer />` (`resources/js/components/ux/typography/icon-renderer.tsx`) renders a lucide icon component reference — useful when the icon comes from a decoration record or other data.

## Requirements

- A Laravel project (items assume Laravel 13, but most conventions apply broadly).
- pnpm as the package manager.
- Laravel Boost, to compile `.ai/guidelines/` into `CLAUDE.md` / `AGENTS.md`.
