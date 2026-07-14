---
name: laravel-postgres-schemas
description: Configure PostgreSQL named schemas for Laravel's default tables. Use when creating the initial schemas migration, moving default or starter-kit tables (users, sessions, cache, jobs, personal access tokens, notifications, passkeys, teams) into named schemas, relocating their models into domain paths, or auditing how default tables are wired across migrations, config, env, and models.
---

# Laravel PostgreSQL Default Schemas

Move every Laravel **default** table into a user-chosen PostgreSQL named schema, wired consistently across four surfaces: migrations, config, env, and models. The project guidelines treat the schema as the domain; this skill covers Laravel's defaults plus Maestro starter-kit tables — any table beyond the defaults map is out of scope and must be ignored.

## Ground rules

- Requires a PostgreSQL connection (`DB_CONNECTION=pgsql`). If the project still points at sqlite, configure the pgsql env block first (`php artisan app:config-db` from `smonteromx/useful-artisan-commands` can prompt for it).
- Never touch the real `.env`. Edit `.env.example` only; the run ends with a copy/paste block the user applies to their real `.env` themselves.
- Migrations and models hardcode schema-qualified names (`{schema}.{table}`). Config files never hardcode: each table config key routes through an env var, and the routing is created when a key lacks it.
- Follow the migration guidelines: single-purpose migrations, `Schema::create('{schema}.{table}')`, `alter_{table}_table` naming, near-present timestamps when reordering.

## Steps

1. **Inventory.** Build the working set from [references/defaults-map.md](references/defaults-map.md): scan `database/migrations`, `config/`, and installed packages, and keep only the rows whose table or migration actually exists in this project — the default set varies with the Maestro starter-kit features chosen at `laravel new` (passkeys, teams, WorkOS), Sanctum, and whether the notifications table was published. Classify each table as **first-wave** (shipped together with the app skeleton) or **late** (its create-table migration has user-owned migrations between it and the first wave). Done when: a written list of every default table found, each mapped to its migration file, config key, env var, model, and wave.

2. **Ask the user.** One schema choice per table in the inventory (group related tables into a single prompt where the UI allows, but record an explicit choice per table), plus two extra questions: keep the `migrations` table in `public` or move it to a custom schema, and — since guidelines mirror the schema into `app/Models/{Domain}/` — whether to relocate the affected models to their domain paths (see the map's Model relocation section) — record a choice per model in the inventory, including the overrides step 6 will create. Done when: every inventoried table has a recorded schema choice, the migrations table has one, and every affected model has a recorded relocation choice.

3. **Schema migrations.** Each distinct chosen schema must be created by exactly one migration that runs before any of its tables:
   - Schemas used by **first-wave** tables go in `0000_00_00_000000_create_initial_schemas.php` (create it if missing, extend it if present), one `CREATE SCHEMA IF NOT EXISTS` statement per schema.
   - Schemas used only by **late** tables stay out of the initial migration: add a dedicated schema migration timestamped just before the corresponding create-table migration. Skip it when the chosen schema is already created by an earlier migration.

   Done when: every chosen schema maps to exactly one creating migration, ordered before its tables.

4. **Table migrations.** Rewrite each default create-table migration (and any framework alter migrations touching them) to the schema-qualified name, including internal references such as foreign keys and morph indexes. Done when: `grep` over `database/migrations` finds no unqualified occurrence of any default table name.

5. **Config and env.** For each config key in the map: route it through its env var with the plain table name as the fallback default, creating the routing where the map marks it missing. Then in `.env.example`, immediately below the DB credentials block, add every schema-qualified value: table vars (e.g. `SESSION_TABLE={schema}.sessions`), `DB_MIGRATIONS_TABLE` when the migrations table moves, and `DB_SEARCH_PATH` listing every chosen schema plus `public` so `migrate:fresh` and `db:wipe` can see them (route the pgsql connection `search_path` through it). If the migrations table moves to a custom schema, also `composer require smonteromx/useful-artisan-commands --dev` — it creates the migrations schema automatically for `migrate*` commands and test runs, with no workarounds. Done when: every config key in the inventory is env-routed and `.env.example` carries every new value in the right block.

6. **Models.** Point every affected default model — including hidden ones — at its schema-qualified table, as detailed per row in the map: `User::$table`, a `PersonalAccessToken` override registered with `Sanctum::usePersonalAccessTokenModel()`, a `DatabaseNotification` override wired into the notifiable's `notifications()` relation, and any starter-kit models. Then relocate each model the user opted in during step 2, following the map's Model relocation section — move, re-namespace, and chase every reference it lists. Done when: every table in the inventory that has a model resolves the qualified name (spot-check with tinker: `(new Model)->getTable()`), and `grep` finds no reference to a moved model's old namespace.

7. **Audit and verify.** Where a default table was already schema-configured before this run, audit it against every rule above and fix drift — same completion bar as fresh work. Then prove the whole setup: `php artisan migrate:fresh` runs clean from an empty database, and the project test suite passes. Done when: both are green.

8. **Handoff.** Print a copy/paste block for the user's real `.env` containing every var added or changed this run, with their chosen values. Done when: the block is delivered and the real `.env` was never edited.
