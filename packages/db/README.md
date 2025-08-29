# Database Package

This package contains the database schema, migrations, and utilities for the project.

## Setup

The database uses SQLite with [Drizzle ORM](https://orm.drizzle.team/) for database operations and migrations.

## Available Commands

Run these commands from the root of the monorepo using Turbo:

```bash
# From the root directory
turbo run db:generate  # Generate migrations
turbo run db:migrate   # Run migrations
turbo run db:push      # Push schema changes to the database
turbo run db:studio    # Open Drizzle Studio for database management
turbo run db:seed      # Seed the database with sample data
```

Or run them directly from the db package:

```bash
# From the packages/db directory
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
bun run db:seed
```

## Database Seeding

The `db:seed` command populates the database with sample data for development purposes. It creates:

- 5 users (1 admin, 4 regular users)
- 10 posts with sample content, randomly assigned to the created users

This is useful for testing and development to have a consistent set of data to work with.

To customize the seed data, edit the `seed.ts` file in this package.

## Schema

The database schema is defined in `schema.ts`. It includes tables for:

- Users
- Sessions
- Accounts
- Verification tokens
- Posts
- API Keys
- Files

## Database Connection

The database connection is established in `trpc.ts` using `@libsql/client` and Drizzle ORM.