This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Submission storage

For production submissions, create a Supabase project and run this SQL in its
SQL Editor:

```sql
create table if not exists public.portfolio_store (
  key text primary key,
  value jsonb not null
);

alter table public.portfolio_store enable row level security;
```

Add these server-only environment variables in Vercel's project settings:

- `SUPABASE_URL`: the project's URL
- `SUPABASE_SERVICE_ROLE_KEY`: the project's service-role key

Redeploy after setting the variables. Never expose the service-role key in
client-side code or commit it to the repository. The first read imports the
submission and approved-portfolio JSON from the existing Vercel Blob store when
it is accessible; keep its token configured until the import succeeds. If the
old Blob store is suspended and cannot be read, contact Vercel support to
recover/export its data before removing `BLOB_READ_WRITE_TOKEN`. Static
portfolios and their existing Google Drive links are unchanged.
