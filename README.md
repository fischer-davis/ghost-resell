# Ghost Repo

Monorepo setup.

## Getting Started

To get started with Ghost repo, you'll need to have [Bun](https://bun.sh/) installed.

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/example/ghost-repo.git
    cd ghost-repo
    ```

2.  **Install dependencies:**

    ```sh
    bun install
    ```

3.  **Set up environment variables:**

    Copy the example environment files and configure them:

    ```sh
    # Root environment (optional)
    cp .env.example .env
    
    # API environment
    cp apps/api/.env.example apps/api/.env
    
    # Web environment
    cp apps/web/.env.example apps/web/.env
    
    # CLI environment (optional)
    cp apps/cli/.env.example apps/cli/.env
    ```

    Update the `.env` files with your desired configuration. The defaults should work for local development.

4.  **Start the development server:**

    ```sh
    bun dev
    ```

This will start the web application, the API, and any other services in the monorepo.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

-   `apps/api`: The backend API powered by Fastify and tRPC.
-   `apps/cli`: A command-line interface for interacting with Ghost Repo.
-   `apps/web`: The main web application built with React and Vite.
-   `packages/auth`: Shared authentication logic.
-   `packages/db`: Database schema and queries using Drizzle ORM.
-   `packages/trpc`: Shared tRPC configurations.
-   `packages/typescript-config`: Shared `tsconfig.json`s used throughout the monorepo.

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting
