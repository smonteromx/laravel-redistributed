# Project Architecture Guidelines

Project-specific architecture rules for this Laravel project. Keep this file focused on structure, boundaries, and ownership. Put implementation details in the scoped guideline files.

## Domain Boundaries

This project uses PostgreSQL named schemas as domain boundaries instead of relying only on the database's default schema. Actual schema names are project-specific and may change between applications, including framework-oriented schemas.

Rules:
- Keep all folder and database structure examples placeholder-based; do not introduce concrete domain, subdomain, schema, or table names in project guidance.
- Create a schema migration when adding a new domain schema, following `0000_00_00_000000_create_initial_schemas.php`.
- Every domain model must explicitly declare a schema-qualified table name: `protected $table = '{domain}.{table}';`.
- Migrations must use schema-qualified table names: `Schema::create('{domain}.{table}', ...)`.
- Treat the PostgreSQL schema as the domain and table as the subdomain.
- Mirror domains and subdomains into app namespaces by default.
- Routes are the exception to nesting and are grouped by domain file.
- Models, Exceptions, Notifications, and Policies stay at the `{Domain}` level with no subdomain nesting (see Domain-Only Directories).

## Directory Structure

Mirror domain schemas and table subdomains into backend namespaces and frontend directories wherever possible. The exceptions below keep some directories at the `{Domain}` level only, and routes stay grouped by domain file.

```text
app/
  Actions/{Domain}/{Subdomain}/
  Constants/{Domain}/{Subdomain}/
  Data/{Domain}/{Subdomain}/
  Enums/{Domain}/{Subdomain}/
  Exceptions/{Domain}/
  Http/Controllers/{Domain}/{Subdomain}/
  Http/Requests/{Domain}/{Subdomain}/
  Models/{Domain}/
  Notifications/{Domain}/
  Policies/{Domain}/
  Queries/{Domain}/{Subdomain}/
resources/js/
  pages/{domain}/{subdomain}/
  components/ui/
  components/ux/
  components/domain/{domain}/{subdomain}/
  models/{domain}/
  enums/{domain}/{subdomain}/
  decorations/{domain}/{subdomain}/
  types/{classification}/
  types/domain/{domain}/{subdomain}/
tests/
  Feature/{Domain}/
```

Domain route files live in `routes/domain/{domain}.php` and are included from `routes/web.php` or `bootstrap/app.php` via `withRouting()`.

### Domain-Only Directories

These directories stop at the `{Domain}` level and never nest by subdomain:

- `app/Exceptions/{Domain}/`
- `app/Models/{Domain}/`
- `app/Notifications/{Domain}/`
- `app/Policies/{Domain}/`
- `resources/js/models/{domain}/`

Domain model examples:

```text
app/Models/{Domain}/{ExampleModel}.php
app/Models/{Domain}/{AnotherExampleModel}.php
```

Do not create model namespaces with subdomain nesting, such as `App\Models\{Domain}\{Subdomain}\{ExampleModel}`.

### Unspecified Directories

When a feature needs an `app/` or `resources/js/` directory that these guidelines do not describe, ask for the preferred structure before creating files in it instead of guessing a layout.

## Cross-Domain Namespaces

Use a cross-domain namespace when a feature has its own controllers, actions, pages, or tests but owns no database schema. Typical examples are dashboards, reporting, and analytics.

```text
app/Http/Controllers/{Namespace}/
app/Http/Requests/{Namespace}/
app/Actions/{Namespace}/
app/Data/{Namespace}/
app/Queries/{Namespace}/
resources/js/pages/{namespace}/
routes/domain/{namespace}.php
tests/Feature/{Namespace}/
```

Key distinction:
- Domain namespace owns tables, models, migrations, factories, and seeders.
- Cross-domain namespace reads from other domains and owns no tables.

## Static Views

Static views are presentational pages with no controller, no business logic, and no database interaction.

Rules:
- Register static routes directly in `routes/web.php` because they belong to no domain.
- Use `Route::inertia()` instead of route closures with `Inertia::render()`.
- Place pages under `resources/js/pages/static/`.

```php
// Sample static routes; replace with the project's real static pages.
Route::inertia('/privacy-policy', 'static/legal/privacy-policy')->name('privacy-policy');
Route::inertia('/terms', 'static/legal/terms')->name('terms');
Route::inertia('/faq', 'static/faq')->name('faq');
```

## Action-Based Architecture

All business logic lives in Action classes. Controllers orchestrate requests and responses only.

Rules:
- Controllers must not contain business logic or database operations; delegate writes to Actions and reads to Query classes.
- Actions own use-case behavior and transaction boundaries; `handle()` is their single entry point.
- Route-bound parameters are passed directly to `handle()`, and the use case may take as many of them as it needs.
- Beyond route parameters, `handle()` accepts at most two extra plain inputs, or a single DTO carrying all reusable form, filter, and command values.
- A DTO never holds route parameters such as route-bound models or their IDs; when used it is the only non-route parameter, never mixed with extra scalars or flags.
- Avoid nested transactions: a reusable Action invoked inside another Action's transaction must not open its own; keep the transaction in the outermost owning Action rather than wrapping every Action unconditionally.
- Controllers may return any response type; write endpoints return a `RedirectResponse` (`back()`, `to_route(...)`) and read endpoints return an Inertia `Response`. Prefer models, collections, paginators, resources, and typed responses for response keys.
- Prefer resourceful CRUD controllers using Laravel's standard method names.
- Abstract entity properties into resource controllers before creating custom controller methods.
- Use invokable controllers only for truly single-purpose actions that cannot be modeled as CRUD.

Controller flow:

```text
FormRequest -> Route params -> Action -> Flash/Session -> Redirect
```

Controller parameter order:

```text
FormRequest -> Route model bindings -> Action (writes) or Query class (reads)
```

## Eloquent Query Classes

Query-composition logic lives in Query classes, mostly the read-side counterpart to Actions. This pattern keeps complex query building out of controllers, Actions, and models. See the Eloquent Query Classes pattern for background: https://wendelladriel.com/blog/eloquent-query-classes-pattern.

Rules:
- Query classes are `final readonly`, live in `app/Queries/{Domain}/{Subdomain}/`, and mirror the domain and subdomain like Actions.
- Name query classes with the `Query` suffix.
- `handle()` is the single entry point, following the same input rules as Action `handle()` (route params passed directly, plus at most two extra inputs or a DTO).
- Controllers and Actions consume Query classes instead of querying inline.
- Reads return models, collections, paginators, or a builder; do not shape presentation arrays.
- A Query class may perform a write when the database query itself is the reusable unit of value, called inside an Action's transaction; broader workflows still belong in Actions.

## Migrations

Rules:
- Prefer single-purpose migrations.
- Non-default Laravel migrations must create or alter only one schema or one table.
- Table alteration migrations must use the `alter_{table}_table` filename pattern, with optional scope after it, such as `alter_{table}_table_for_{scope}`.
- Group multiple tables only when they are Laravel framework default tables that Laravel itself normally ships together.
- Keep schema-qualified table names in every migration.
- Generate migrations with the current present timestamp. The only non-present timestamps allowed are Laravel's default framework migrations; when you must reorder migration history, mimic a near-present timestamp rather than an arbitrary far-past one.

## Future Feature Checklist

When implementing a new domain feature:

1. Choose the domain and subdomain namespace before creating files.
2. Create the schema migration if the feature introduces a new domain.
3. Create single-purpose table migrations with clear names.
4. Create the model under `app/Models/{Domain}/` with explicit schema-qualified `$table` and `casts()` method.
5. Create factories and seeders when the model needs test or seed data.
6. Create Form Requests with shared validation constants, a policy-backed `authorize()`, and `toData()` DTO mapping when needed.
7. Create Actions for business logic, transactions, and custom domain exceptions.
8. Create Query classes for the reads that index and show controllers need.
9. Create thin resource controllers or invokable controllers that delegate writes to Actions and reads to Query classes.
10. Add routes in `routes/domain/{domain}.php` and group subdomains internally.
11. Create Inertia pages under `resources/js/pages/{domain}/{subdomain}/`.
12. Mirror the backend models and enums the frontend needs into `resources/js/models/{domain}/` and `resources/js/enums/{domain}/{subdomain}/`, and decorate enums for UI.
13. Write Pest tests under `tests/Feature/{Domain}/`, preferring one `{Subdomain}Test.php` file per subdomain.
14. Run the relevant quality checks before finalizing.
