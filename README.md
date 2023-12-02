# Pokedex

A Pokedex that uses [Vercel Postgres](https://vercel.com/postgres) as the database, [Prisma](https://prisma.io/) as the ORM with [pgvector](https://github.com/pgvector/pgvector-node#prisma) to enable vector similarity search, and OpenAI's [`text-embedding-ada-002`](https://platform.openai.com/docs/guides/embeddings) model for embeddings.

Edit the seed.ts file if you want to generate your own embeddings with an open ai key

## Demo

https://pokedex-seven-sigma.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/antonioperez/Pokedex&env=OPENAI_API_KEY&envDescription=Get+your+OpenAI+API+key+here%3A&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=pokedex&repository-name=pokedex&demo-title=Pokedex&demo-description=Semantic+Pokedex&demo-url=https://pokedex-seven-sigma.vercel.app&demo-image=https://pokedex-seven-sigma.vercel.app/pokeball.jpg&stores=%5B%7B%22type%22%3A%22kv%22%7D%2C%7B%22type%22%3A%22postgres%22%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/antonioperez/Pokedex
```

Once that's done, copy the .env.example file in this directory to .env (which will be ignored by Git):

```bash
cp .env.example .env
```

Then open `.env` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode. Remember to build first to seed your database:

```bash
pnpm build
```

```bash
pnpm dev
```
