# laravel-redistributed

A [shadcn registry](https://ui.shadcn.com/docs/registry) that distributes opinionated project defaults for Laravel + Inertia + React applications: AI guidelines, feedback primitives, enums, hooks, and other conventions-backed building blocks.

This repository is the registry itself — items install directly from GitHub with the `shadcn` CLI. No registry server, no build step.

## Usage

Install an item into your Laravel project:

```bash
npx shadcn@latest add smonteromx/laravel-redistributed/<item>
```

## Items

| Item | Description | Installs to |
| --- | --- | --- |
| `guidelines` | Laravel Boost AI guidelines: project architecture, backend and frontend conventions, testing, and quality pipelines. | `.ai/guidelines/` |

### guidelines

```bash
npx shadcn@latest add smonteromx/laravel-redistributed/guidelines
```

The guidelines are [Laravel Boost](https://github.com/laravel/boost) sources. After installing, regenerate your agent context files:

```bash
php artisan boost:update
```

## Requirements

- A Laravel project (the guidelines assume Laravel 13, Inertia v3, React 19, Tailwind v4, and Pest 4, but most conventions apply broadly).
- Laravel Boost, to compile `.ai/guidelines/` into `CLAUDE.md` / `AGENTS.md`.
