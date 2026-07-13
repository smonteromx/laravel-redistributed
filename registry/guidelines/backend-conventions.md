# Backend Conventions

Project-specific Laravel backend rules. These intentionally override or tighten Laravel defaults where this project has stronger conventions.

All class names below are sample placeholders (`Example*`); replace them with the feature's real domain names.

These conventions reference project-provided defaults such as the `Inertia::notify` macro, `AppException`, `FlashResponse`, and `EmphasisVariant`. These defaults are distributed as items of the `smonteromx/laravel-redistributed` shadcn registry. If a referenced default is missing from the project, install its item (confirm with the user first) instead of reimplementing it:

```bash
pnpm dlx shadcn@latest add smonteromx/laravel-redistributed/{item}
```

| Missing default | Registry item |
| --- | --- |
| `Inertia::notify` macro, `AppException`, `FlashResponse`, `EmphasisVariant` | `feedback-inertia` |
| `HandleAppearance` middleware | `appearance-react` |

Installing an item is not the whole job: several items require manual wiring afterwards, documented per item in the registry README (https://github.com/smonteromx/laravel-redistributed#readme). Follow the installed item's section there and complete every post-install step — the default is halfway implemented until its wiring is done. For example, `feedback-inertia` requires declaring the macro in `AppServiceProvider::boot()`, and `appearance-react` requires registering the middleware in `bootstrap/app.php`.

## Controllers

Controllers orchestrate only.

Rules:
- Do not query the database from controllers; delegate reads to Query classes and writes to Actions.
- Do not call Eloquent write methods, query builder methods, or the `DB` facade from controllers.
- Do not validate inline; use Form Requests.
- Inject parameters in this order: Form Request, route model bindings, Action or Query class.
- Resource controllers should use only Laravel's standard methods: `index`, `create`, `store`, `show`, `edit`, `update`, and `destroy`.
- Model extra behavior as a resourceful property controller when possible, such as `ExampleStatusController@update`; use invokable controllers only when it cannot be expressed as resource CRUD.
- Write endpoints return a `RedirectResponse` via `back()` or `to_route(...)` after delegating work.
- Read endpoints return an Inertia `Response` via `Inertia::render(...)`.
- Use `Inertia::notify()` for user feedback.

```php
use Inertia\Response;

class ExampleController extends Controller
{
    public function index(ExampleListingQuery $query): Response
    {
        return Inertia::render('example/index', [
            'examples' => $query->handle(active: true),
        ]);
    }

    public function store(StoreExampleRequest $request, CreateExampleAction $action): RedirectResponse
    {
        $action->handle($request->toData());

        Inertia::notify('Example created successfully.', FlashResponse::TOAST);

        return back();
    }
}
```

## Actions And Transactions

Actions own business logic and database mutations. `handle()` is the single entry point.

Rules:
- Use explicit `handle()` parameter and return types.
- Route-bound parameters (models and route values) are passed directly to `handle()`; the use case may take as many of them as it needs.
- Beyond route parameters, `handle()` accepts at most two extra plain inputs (scalars or flags), or a single DTO carrying all reusable form, filter, and command values.
- A DTO never holds route parameters, and when used it is the only non-route parameter; never add extra scalars or flags alongside a DTO.
- Valid signatures include `handle(ExampleModel $example)`, `handle(ExampleModel $example, bool $active)`, `handle(CreateExampleData $data)`, and `handle(ExampleModel $parent, ExampleModel $child, UpdateExampleData $data)`.
- Wrap a use case's writes in `DB::transaction(...)` at its outermost boundary; do not wrap unconditionally.
- Avoid nested transactions. A reusable Action invoked inside another Action's transaction must not open its own; keep the transaction in the outermost owning Action and check the transaction context (such as `DB::transactionLevel()`) when a class can run both standalone and nested.
- Prefer returning models, collections, paginators, resources, redirects, or responses; favor these typed shapes over hand-built arrays for response keys.
- Do not return narrowly mapped response shapes when a model and its relations already carry the needed data; load the relations and return the model instead of building an unnecessary presentation array.
- Dispatch jobs, events, notifications, and broadcasts that depend on changed data after commit.
- Avoid try-catch unless integrating with external services or translating an expected failure into a domain exception.

```php
use Illuminate\Support\Facades\DB;

class CreateExampleAction
{
    public function handle(CreateExampleData $data): ExampleModel
    {
        return DB::transaction(fn (): ExampleModel => ExampleModel::query()->create([...]));
    }
}
```

## Eloquent Query Classes

Query classes own query-composition logic. They are mostly the read-side counterpart to Actions and keep query building out of controllers, Actions, and models. See the Eloquent Query Classes pattern for background: https://wendelladriel.com/blog/eloquent-query-classes-pattern.

Rules:
- Query classes are `final readonly`, live in `app/Queries/{Domain}/{Subdomain}/`, and carry the `Query` suffix.
- `handle()` is the single entry point, and it follows the same input rules as Action `handle()`: route-bound parameters passed directly, plus at most two extra plain inputs or a single DTO, and DTOs never hold route parameters.
- Controllers and Actions consume query classes through `handle()` instead of querying inline.
- Reads return models, collections, paginators, or a builder; do not shape presentation arrays.
- A query class may perform a write when the database query itself is the reusable unit of value, used inside an Action's transaction (see https://wendelladriel.com/blog/eloquent-query-classes-pattern#query-classes-can-write-too). Broader business workflows still belong in Actions.

```php
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class ExampleListingQuery
{
    public function handle(?bool $active = null, int $perPage = 15): LengthAwarePaginator
    {
        return ExampleModel::query()
            ->when($active !== null, fn ($query) => $query->where('is_active', $active))
            ->latest()
            ->paginate($perPage);
    }
}
```

## DTOs

Use DTOs for inbound form, filter, and command data.

Rules:
- DTOs live in `app/Data/{Domain}/{Subdomain}/` when the domain has subdomains.
- DTOs are `final readonly` classes.
- DTOs must contain at least three public input properties; use plain Action parameters for one or two values.
- DTOs contain only scalar, filter, and form values; never include route parameters such as route-bound models or their IDs.
- Do not create DTOs only to return model data to controllers or frontend components.
- Reusable input groups such as search or pagination should be extracted to DTO traits with public readonly props and explicit setters/builders for individual values and the group.
- Use constructor property promotion.

```php
final readonly class CreateExampleData
{
    public function __construct(
        public string $name,
        public string $description,
        public bool $active,
    ) {}
}
```

## Form Requests

Use Form Requests for validation and request-to-DTO transformation.

Rules:
- Never validate inline in controllers.
- Authorize the request in the `authorize()` method, delegating to a policy ability (see Authorization).
- Add `toData()` when validation feeds an Action or Query DTO; never name this method `getData()` or `toDto()`.
- Move validation rules reused by multiple Form Requests into `App\Constants\{Domain}\{Subdomain}\...` and spread them with `[...]`.
- Use model classes in database validation rules instead of raw table names.
- Import models from `App\Models\{Domain}\...`; models do not use subdomain namespaces.

```php
use Illuminate\Validation\Rule;

class StoreExampleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', ExampleModel::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', Rule::unique(ExampleModel::class, 'slug')],
            'active' => ['required', 'boolean'],
        ];
    }

    public function toData(): CreateExampleData
    {
        return new CreateExampleData(
            name: $this->string('name')->toString(),
            description: $this->string('description')->toString(),
            active: $this->boolean('active'),
        );
    }
}
```

## Model-Aware Database Rules

Validation rules that need a model table must reference the model class instead of a raw table name. This prevents ambiguity between Laravel's `{connection}.{table}` notation and PostgreSQL's `{schema}.{table}` notation.

```php
Rule::unique(ExampleModel::class, 'slug');
Rule::exists(ExampleModel::class, 'id');
```

## Authorization

Rules:
- Prefer policies over gates. Policies declare the abilities and group authorization around a model or resource.
- Prefer authorizing in the Form Request `authorize()` method, calling a policy ability through `$this->user()->can(...)`. The `authorize()` method consumes abilities; it never declares them.
- When no custom Form Request backs the route, fall back to the static `Gate::authorize(...)` facade method in the controller. The base controller in Laravel 13 has no `$this->authorize()` helper, so do not call it.
- Authorize before calling Actions, never after.
- Use kebab-case ability names in `Gate::authorize(...)` and `can(...)` checks, such as `update-status`.
- Laravel automatically maps kebab-case ability names to camelCase policy methods, so `update-status` should be implemented as `updateStatus()` in the policy.
- Policies live under `App\Policies\{Domain}` (domain only, no subdomain).

## Enums

Rules:
- Domain enums live under `App\Enums\{Domain}\{Subdomain}` when the domain has subdomains.
- Use enum namespaces that match the behavior's domain and subdomain, even when the enum values are rendered on multiple frontend pages.
- Cross-cutting framework enums that belong to no domain live at the enum root. `EmphasisVariant` is `App\Enums\EmphasisVariant`, not under a domain or a `Frontend` subfolder.

## Constants

Rules:
- Shared constants live under `App\Constants\{Domain}\{Subdomain}`.
- Do not hide reusable constants inside DTOs, controllers, requests, or enums.

## Exceptions And Feedback

Use `AppException` for expected domain failures.

Rules:
- Create specific domain exceptions under `App\Exceptions\{Domain}` (domain only, no subdomain) extending `AppException`.
- Throw custom exceptions from Actions for expected business-rule failures.
- Let `AppException` flash feedback via `Inertia::notify()` and redirect back.
- Use `FlashResponse::ALERT` for persistent inline feedback.
- Use `FlashResponse::TOAST` for transient toast feedback.

```php
class ExampleRuleException extends AppException
{
    public function __construct()
    {
        parent::__construct('Example rule was violated.', FlashResponse::ALERT, EmphasisVariant::DESTRUCTIVE);
    }
}
```

## Notifications And Mail

Rules:
- Notifications live under `App\Notifications\{Domain}` (domain only, no subdomain).
- Prefer Laravel Notifications over Mail classes for user-facing messages.
- Use Mail classes only when the email template itself is the primary abstraction or a package requires it.
- Queue notifications that can be delayed and dispatch them after commit when they depend on changed data.

## Application Defaults

Configured in `AppServiceProvider::configureDefaults()`:

- `CarbonImmutable` is the default date class.
- Destructive DB commands are prohibited in production.
- Strict model mode is enabled outside production.
- Vite prefetching is aggressive.
- HTTPS is forced in production.
- Production passwords require at least 12 characters, mixed case, letters, numbers, symbols, and uncompromised checks.
