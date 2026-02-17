This is a [Next.js](https://nextjs.org) project.

## Environment Setup (Safe DEV/PROD)

Use these environment variables:

- `NEXT_PUBLIC_WORDPRESS_API_URL` -> WordPress GraphQL endpoint (`.../graphql`)
- `NEXT_PUBLIC_WORDPRESS_SITE_URL` -> WordPress site/media base URL (without `/graphql`)

Local development (`.env.local`):

```bash
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost/v2maiyah/graphql
NEXT_PUBLIC_WORDPRESS_SITE_URL=http://localhost/v2maiyah
```

Vercel Preview/Production:

```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://assets.mymaiyah.id/graphql
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://assets.mymaiyah.id
```

After changing Vercel env vars, redeploy.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

