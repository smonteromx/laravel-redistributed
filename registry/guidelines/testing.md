# Testing Guidelines

Project-specific testing rules for Pest, Laravel feature tests, architecture tests, and browser coverage.

## Baseline

Rules:
- All PHP tests must use Pest.
- Create tests with `php artisan make:test --pest {Name}`.
- Prefer feature tests for user-facing behavior and backend flows.
- Use unit tests for isolated pure logic only.
- Do not delete tests without approval.
- Every test file for a feature must cover more than the happy path.

## Test Location

Rules:
- Domain feature tests live in `tests/Feature/{Domain}/`; test folders stop at the schema/domain level, like models.
- Prefer one feature test file per subdomain/table concern, named `tests/Feature/{Domain}/{Subdomain}Test.php`.
- Creating more than one feature test file for the same subdomain requires a strong reason, such as clearly independent workflows that would make one file hard to scan.
- General feature tests that are not scoped to one domain live directly under `tests/Feature/` as `{Concern}Test.php`.
- General feature tests that are scoped to one domain live in that domain folder and are named `tests/Feature/{Domain}/{Domain}Test.php`.
- Only create a folder for a general testing concern when several files are truly clearer than one file; when those files are domain-scoped, name them `{Domain}{Concern}Test.php`.
- Cross-domain feature tests live in `tests/Feature/{Namespace}/`.
- Unit tests live in `tests/Unit/` only for isolated pure logic.
- Browser tests live in `tests/Browser/`.

## Minimum Feature Coverage

For each feature, cover the relevant risks:

- Validation: missing required fields, invalid formats, out-of-range values, boundary values, and malformed payloads.
- Authorization: unauthenticated access, unauthorized users, and users modifying resources they do not own.
- Business rules: backend enforcement of every story constraint, not only UI warnings or disabled buttons.
- Destructive actions: delete, disable, cancel, detach, archive, and last-item scenarios.
- Persistence: expected database state after success and after failure.
- Feedback: expected callout or transient response when behavior depends on user feedback.

Use Pest datasets for repeated invalid payloads and boundary cases.

```php
it('validates email addresses', function (array $payload, string $field) {
    $this->post(route('examples.store'), $payload)->assertInvalid($field);
})->with([
    'missing email' => [['email' => null], 'email'],
    'invalid email' => [['email' => 'not-an-email'], 'email'],
]);
```

## Database Testing

Rules:
- Use factories and factory states instead of hand-building records.
- Prefer `assertModelExists()` / `assertModelMissing()` for model lifecycle checks.
- Use `assertDatabaseHas()` and `assertDatabaseMissing()` when verifying specific persisted attributes.
- Assert rollback behavior when a transaction-protected Action can fail midway.
- Do not use tinker or custom scripts as a substitute for tests.

## Inertia And HTTP Testing

Rules:
- Assert the route response, component, props, redirects, validation errors, and flashed feedback where relevant.
- Prefer named routes over hardcoded URLs.
- Prefer semantic response assertions like `assertSuccessful()`, `assertForbidden()`, `assertNotFound()`, and `assertRedirect()`.
- Verify protected routes reject guests and unauthorized users.

## Architecture Testing

Use Pest architecture tests to enforce project boundaries that should not regress.

Cover at minimum:
- Controllers do not use `DB`, query builder, or Eloquent write operations directly.
- Controllers have the `Controller` suffix and stay in `app/Http/Controllers/{Domain}/{Subdomain}/` or a valid cross-domain namespace.
- Resource controllers use only standard Laravel resource method names.
- Actions have the `Action` suffix and expose a single typed `handle()` entry point.
- Beyond route-bound parameters, `handle()` accepts at most two extra plain inputs or a single DTO; a DTO is never mixed with extra scalars or flags.
- DTOs are `final readonly` classes under `app/Data/{Domain}/{Subdomain}/`.
- DTOs contain at least three public input properties and carry no route parameters.
- Query classes are `final readonly`, carry the `Query` suffix, live under `app/Queries/{Domain}/{Subdomain}/`, and expose a `handle()` entry point following the same input rules as Actions.
- Form Requests live under `app/Http/Requests/{Domain}/{Subdomain}/` and expose `rules()`; expose `toData()` (never `getData()`/`toDto()`) when paired with a DTO.
- Models live directly under `app/Models/{Domain}/` and declare explicit schema-qualified table names.
- Exceptions, notifications, and policies live directly under `app/Exceptions/{Domain}/`, `app/Notifications/{Domain}/`, and `app/Policies/{Domain}/` (domain only, no subdomain).
- Enums and constants follow domain/subdomain namespaces.
- Enums live under `app/Enums/{Domain}/{Subdomain}/` when the domain has subdomains, except cross-cutting enums like `EmphasisVariant` which live at the enum root.
- Non-default Laravel migrations create or alter only one schema or one table.
- Table alteration migration filenames use the `alter_{table}_table` pattern, with optional scope after it.
- Static pages use `Route::inertia()` and live under `resources/js/pages/static/`.

Example direction:

```php
arch('controllers stay thin')
    ->expect('App\Http\Controllers')
    ->not->toUse('Illuminate\Support\Facades\DB');
```

## Browser Testing

Use browser tests for critical user journeys where JavaScript, Inertia navigation, forms, responsive layout, or browser-only behavior must be proven.

Cover at minimum:
- Authentication-critical flows.
- Multi-step forms or flows with client-side state.
- Pages where frontend validation, disabled states, or dynamic UI can hide backend failures.
- Critical responsive layouts on mobile and desktop.
- Dark mode for components with semantic emphasis variants.
- Smoke tests for important public and authenticated pages.

Browser test assertions should include:
- `assertNoJavaScriptErrors()` for every browser flow.
- `assertNoConsoleLogs()` for smoke tests unless console output is intentionally expected.
- `assertNoAccessibilityIssues()` for critical pages when browser tooling is available.

If the Pest browser plugin is not installed, do not add dependencies without approval; document the missing coverage and use feature tests for backend guarantees.

## Running Tests

Commands:
- Run all tests: `php artisan test --compact`.
- Run one file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- Run a filter: `php artisan test --compact --filter=testName`.
- Run the project test script: `composer run test`.

Before finalizing a feature, run the smallest relevant test set first, then the broader suite when practical.
