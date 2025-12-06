const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  console.error(
    "Define them in .env.local or via your deployment provider and rerun the command."
  );
  process.exit(1);
}
