import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./app/lib/db/schema.ts",
  out: "./drizzle",
  // driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  // dbCredentials: {
  //   // connectionString: process.env.NEON_DATABASE_URL!
  //   host: process.env.DB_HOST!,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME!,
  // },
  verbose: true,
} satisfies Config;
