# EduChain

This is the EduChain Next.js dashboard project.

## Supabase

- Create a Supabase project and run the SQL script provided in the docs to seed the schema.
- Copy the project URL and anon key from **Settings > API**.
- Create a `.env.local` file and add:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
  ```
- Restart the dev server so the env values are picked up.

Once the client is available (`src/lib/supabase/client.ts`) the UI can start calling Supabase tables instead of the mock data.
