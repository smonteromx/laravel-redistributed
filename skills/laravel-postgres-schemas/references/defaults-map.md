# Defaults Map

Every Laravel default table this skill manages, with the four surfaces to wire. "Routing exists" reflects a stock Laravel 13 skeleton — always verify against the project's actual config files, since older skeletons differ.

## First-wave tables (app skeleton)

| Table | Default migration | Config key | Env var | Routing exists | Model |
| --- | --- | --- | --- | --- | --- |
| `users` | `0001_01_01_000000_create_users_table` | — | — | — | `App\Models\User` → set `$table` |
| `password_reset_tokens` | `0001_01_01_000000_create_users_table` | `auth.passwords.users.table` | `AUTH_PASSWORD_RESET_TOKEN_TABLE` | yes | — |
| `sessions` | `0001_01_01_000000_create_users_table` | `session.table` | `SESSION_TABLE` | yes | — |
| `cache` | `0001_01_01_000001_create_cache_table` | `cache.stores.database.table` | `DB_CACHE_TABLE` | yes | — |
| `cache_locks` | `0001_01_01_000001_create_cache_table` | `cache.stores.database.lock_table` | `DB_CACHE_LOCK_TABLE` | yes (no fallback — set it) | — |
| `jobs` | `0001_01_01_000002_create_jobs_table` | `queue.connections.database.table` | `DB_QUEUE_TABLE` | yes | — |
| `job_batches` | `0001_01_01_000002_create_jobs_table` | `queue.batching.table` | `DB_QUEUE_BATCHES_TABLE` | **no — create** | — |
| `failed_jobs` | `0001_01_01_000002_create_jobs_table` | `queue.failed.table` | `DB_QUEUE_FAILED_TABLE` | **no — create** | — |

## Starter-kit tables (Maestro)

Starter kits are composed by `laravel/maestro`, the official starter orchestrator — features are chosen at `laravel new`, so each of these tables *might exist*: inventory the ones whose migrations are present and skip the rest. The authoritative current list is `kits/Shared/{kit}/database/migrations` in the [laravel/maestro](https://github.com/laravel/maestro/tree/main/kits/Shared) repo — consult it when a migration in the project doesn't match a row here.

| Table | Kit | Default migration | Config key | Env var | Model |
| --- | --- | --- | --- | --- | --- |
| `passkeys` | Fortify | `2024_01_01_000000_create_passkeys_table` | — | — | Create `App\Models\Passkey extends Laravel\Passkeys\Passkey` with `$table`; register in a provider with `Passkeys::usePasskeyModel(Passkey::class)` |
| `teams` | Teams | `2026_01_27_000001_create_teams_table` | — | — | `Team` → set `$table` |
| `team_members` | Teams | same migration as `teams` | — | — | `Membership` (extends `Pivot`) → set `$table` |
| `team_invitations` | Teams | same migration as `teams` | — | — | `TeamInvitation` → set `$table` |

Column-only feature migrations (`add_two_factor_columns_to_users_table`, `add_current_team_id_to_users_table`) alter `users` and need nothing. The WorkOS kit replaces the users migration and creates only `users` and `sessions` — no `password_reset_tokens`, so that row drops out of the inventory.

## Late tables (published after the skeleton)

These are late only when user-owned migrations sit between them and the first wave; published immediately on a fresh project, they count as first-wave.

| Table | Default migration | Config key | Env var | Model |
| --- | --- | --- | --- | --- |
| `personal_access_tokens` | Sanctum publish (`create_personal_access_tokens_table`) | — | — | Create `App\Models\PersonalAccessToken extends Laravel\Sanctum\PersonalAccessToken` with `$table`; register in a provider with `Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class)` |
| `notifications` | `notifications:table` publish (`create_notifications_table`) | — | — | Create `App\Models\DatabaseNotification extends Illuminate\Notifications\DatabaseNotification` with `$table`; override `notifications()` on notifiable models: `return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();` |

## Infrastructure

| Concern | Config key | Env var | Routing exists | Notes |
| --- | --- | --- | --- | --- |
| `migrations` table | `database.migrations.table` | `DB_MIGRATIONS_TABLE` | **no — create** | If moved to a custom schema, require `smonteromx/useful-artisan-commands` (dev): it detects `schema.table` notation and creates the schema before `migrate*` commands and test runs. Its schema is never part of the initial schemas migration — the migrator needs it before migrations run. |
| pgsql `search_path` | `database.connections.pgsql.search_path` | `DB_SEARCH_PATH` | **no — create** | Must list every chosen schema plus `public`, comma-separated, so `migrate:fresh` / `db:wipe` can drop tables across schemas. |

## Model relocation

The project guidelines treat the schema as the domain and mirror it into `app/Models/{Domain}/` (domain-only, no subdomain nesting). For each model the user opted to relocate, the schema chosen for its table decides the path: move it to `app/Models/{Domain}/{Model}.php` with namespace `App\Models\{Domain}` (overrides created this run — `PersonalAccessToken`, `DatabaseNotification`, `Passkey` — are created there directly), then chase every reference:

- Imports and FQCN strings across `app/`, `bootstrap/`, `config/`, `database/`, `routes/`, `tests/`.
- `config/auth.php` → `providers.users.model` when `User` moves.
- Factories: conventional discovery only resolves `App\Models\{Model}` — set `protected $model` on the factory or `newFactory()` on the model.
- Registered overrides follow the new namespace: `Sanctum::usePersonalAccessTokenModel(...)`, `Passkeys::usePasskeyModel(...)`; `Passkeys::$userModel` defaults to `App\Models\User`, so call `Passkeys::useUserModel(...)` when `User` moves and passkeys are installed.

## Env block shape

New vars sit immediately below the DB credentials in `.env.example`, plain-table defaults in config, schema-qualified values in env:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=example
DB_USERNAME=postgres
DB_PASSWORD=
DB_SEARCH_PATH=public,{schema},{schema}
DB_MIGRATIONS_TABLE={schema}.migrations
DB_CACHE_TABLE={schema}.cache
DB_CACHE_LOCK_TABLE={schema}.cache_locks
DB_QUEUE_TABLE={schema}.jobs
DB_QUEUE_BATCHES_TABLE={schema}.job_batches
DB_QUEUE_FAILED_TABLE={schema}.failed_jobs
SESSION_TABLE={schema}.sessions
AUTH_PASSWORD_RESET_TOKEN_TABLE={schema}.password_reset_tokens
```
