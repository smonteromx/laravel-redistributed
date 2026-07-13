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

- `App\Macros\InertiaNotifyMacro` — registers `Inertia::notify(string $message, FlashResponse $style, EmphasisVariant $variant)` to flash `alert` (callout) or `toast` (transient) payloads.
- `App\Enums\FlashResponse` — `CALLOUT` (persistent inline) and `TRANSIENT` (toast) channels.
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

## Requirements

- A Laravel project (items assume Laravel 13, but most conventions apply broadly).
- pnpm as the package manager.
- Laravel Boost, to compile `.ai/guidelines/` into `CLAUDE.md` / `AGENTS.md`.
