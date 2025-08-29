# Ghost Drop Project Guidelines

## Project Overview

Ghost Drop is a file sharing application that allows users to upload files and share them with a link. Files are automatically deleted after a certain period, providing temporary and secure file sharing capabilities.

## Project Structure

This is a monorepo managed with Turborepo and Bun as the package manager. The project is organized as follows:

### Apps

- **apps/web**: The main web application built with React and Vite
  - Uses a component-based architecture
  - Implements routing (likely TanStack Router)
  - Has theming support
  - Organized with components, hooks, routes, utils, and lib directories

- **apps/api**: The backend API powered by Fastify and tRPC
  - Handles file uploads using tus for resumable uploads
  - Uses node-cron for scheduled tasks (like file cleanup)
  - Integrates with the shared packages for auth and database

- **apps/cli**: A command-line interface for interacting with Ghost Drop

### Packages

- **packages/db**: Database schema and queries using Drizzle ORM
  - Uses SQLite (likely Turso) as the database
  - Defines schemas for users, files, sessions, accounts, verifications, and API keys
  - Provides utilities for database operations

- **packages/auth**: Shared authentication logic
  - Supports multiple authentication providers
  - Handles session management
  - Implements role-based access control

- **packages/trpc**: Shared tRPC configurations for type-safe API endpoints

- **packages/typescript-config**: Shared TypeScript configurations

## Tech Stack

### Frontend
- **React**: UI library
- **Vite**: Build tool and development server
- **TanStack Router**: (likely) For routing
- **TanStack Query**: For data fetching and state management
- **TypeScript**: For type safety

### Backend
- **Fastify**: Web server framework
- **tRPC**: For type-safe API endpoints
- **tus**: For resumable file uploads
- **node-cron**: For scheduled tasks

### Database
- **SQLite** (likely Turso): Database engine
- **Drizzle ORM**: For database operations
- **drizzle-kit**: For migrations and schema management

### Development Tools
- **Bun**: JavaScript runtime and package manager
- **Turbo**: Monorepo management
- **Biome**: Code linting and formatting
- **TypeScript**: For type safety across the entire project

## Development Workflow

### Setup
1. Clone the repository
2. Install dependencies with `bun install`
3. Set up environment variables (copy .env.example files)

### Development
1. Start the development server with `bun dev`
2. This will start all services in the monorepo concurrently

### Database
1. Generate migrations: `bun db:generate`
2. Apply migrations: `bun db:push`
3. Seed the database: `bun db:seed`
4. Use Drizzle Studio for database visualization: `bun db:studio`

### Building
1. Build the project with `bun build`
2. This will build all packages and apps in the correct order

### Code Quality
1. Lint the code with `bun lint`
2. Fix linting issues with `bun lint-fix`
3. The project uses Biome for linting and formatting
4. Pre-commit hooks are set up with husky and lint-staged

## Testing

When implementing changes, you should:

1. Write tests for new functionality
2. Run existing tests to ensure your changes don't break existing functionality
3. Test edge cases, especially around file uploads and authentication

## Code Style Guidelines

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Use the component architecture for frontend code
4. Follow the repository pattern for database operations
5. Use tRPC for all API endpoints
6. Document complex functions and components
7. Use meaningful variable and function names
8. Keep components and functions small and focused on a single responsibility

## Submitting Changes

Before submitting changes:

1. Ensure all tests pass
2. Ensure the code lints without errors
3. Build the project to ensure it compiles correctly
4. Test the functionality manually
5. Document any new features or changes in the appropriate README files