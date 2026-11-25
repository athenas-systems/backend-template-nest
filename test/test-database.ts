import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function truncateTables(): Promise<void> {
  const { rows } = await pool.query<{ tablename: string }>(
    `SELECT tablename FROM pg_tables
     WHERE schemaname = 'public' AND tablename <> '__drizzle_migrations'`,
  );
  if (rows.length === 0) return;

  const tableNames = rows
    .map(({ tablename }) => `"${tablename.replaceAll('"', '""')}"`)
    .join(", ");
  await pool.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`);
}

export async function closeTestDatabase(): Promise<void> {
  await pool.end();
}
