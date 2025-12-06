# EduChain

This is the EduChain Next.js dashboard project.

## Supabase

- Create a Supabase project, run the SQL schema script, and seed the tables.
- Grab the **Project URL** and the **anon** key from **Project Settings > API** (both are shown on the API page you captured).
- Add those values to `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://kdyztkrjgsasnwxngwv.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
  ```
- Restart the dev server so the env values are picked up. Export the same variables in your deployment provider (Vercel, Netlify, etc.) so `npm run build` and API routes work.

Once the client is available (`src/lib/supabase/client.ts`) the UI starts calling Supabase tables instead of the mock data.
- The repository now includes `scripts/check-env.js`. Every time you run `npm run dev`, `npm run build` or `npm start`, Node first ensures:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  ```
  If any are missing, the command exits with a helpful message so you never fire up the app without real credentials.
