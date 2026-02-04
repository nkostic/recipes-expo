# Recipe App

React Native app for managing recipes. Built with Expo, Clerk, and Convex.

## Features

- Authentication with Clerk
- Image upload via Convex storage
- Recipe CRUD operations
- Real-time sync
- iOS and Android

## Quick Start

**Prerequisites:** Node.js v18+, pnpm, [Expo Go](https://expo.dev/client), accounts on [Clerk](https://clerk.com) and [Convex](https://convex.dev)

```bash
git clone <repository-url>
cd recipes-expo
pnpm install
cp .env.example .env.local  # fill in credentials
npx convex dev              # terminal 1
pnpm start                  # terminal 2
```

See [docs/SETUP.md](docs/SETUP.md) for detailed setup.

## Tech Stack

- Expo (React Native) + TypeScript
- Clerk (auth)
- Convex (database + storage)
- Expo Router
- React Hook Form + Zod

## Structure

```
src/
├── app/           # Pages (auth, tabs, recipe)
├── components/    # UI components
├── hooks/         # useRecipes, useImageUpload
├── providers/     # Convex + Clerk providers
└── types/
convex/
├── schema.ts      # Database schema
├── recipes.ts     # Backend functions
└── auth.config.ts # JWT config
```

## License

MIT
