import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export default async function globalSetup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must point to the dedicated test database.");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await migrate(drizzle({ client: pool }), { migrationsFolder: "./drizzle" });
  } finally {
    await pool.end();
  }
}
