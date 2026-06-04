# Catch 'Em All 🧸

A custom Pokémon **plush toy** collection tracker — like a card collector site, but for the stuffed toys. Mark what you own, build a wishlist, and watch your completion grow.

## Features

- **Browse** the plush catalog with search and filters (type, generation, plush line, status) and sorting.
- **Track** each plush as _Owned_ or _Wishlist_ — saved to your browser (`localStorage`), no account needed.
- **My Collection** dashboard: completion % overall and by generation / type / line, estimated value, and your wishlist.
- **Per-plush detail** pages with your own notes, price paid, where bought, condition, and a photo upload — plus live Pokédex data (height, weight, flavor text) from PokéAPI.

## Tech

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + [Tailwind CSS v4](https://tailwindcss.com)
- Static export (`output: "export"`) so it deploys as plain files
- Pokémon artwork & details from [PokéAPI](https://pokeapi.co); the plush catalog itself is curated in [`src/data/plushes.ts`](src/data/plushes.ts)

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

Build the static site:

```bash
npm run build    # outputs to ./out
```

## Adding plushies

Edit [`src/data/plushes.ts`](src/data/plushes.ts) and add an entry to the `PLUSHES` array. `id` must be unique; `dexId` is the National Pokédex number (used to fetch artwork and details). Filters and stats update automatically.

## Deploying to AWS Amplify

This repo includes [`amplify.yml`](amplify.yml) configured for the static export.

1. In the [Amplify console](https://console.aws.amazon.com/amplify), choose **Create new app → Host web app** and connect this GitHub repo.
2. Amplify auto-detects `amplify.yml`; the build outputs the `out/` directory.
3. Deploy. Every push to `main` redeploys automatically.

> Because it's a static export, Amplify serves it as static files — no server runtime required.

## Roadmap ideas

- Cloud sync across devices (Amplify Gen 2: Cognito auth + DynamoDB + S3 for photos)
- Variant tracking (shiny, sizes, exclusives), trade/duplicate lists, and CSV import/export
