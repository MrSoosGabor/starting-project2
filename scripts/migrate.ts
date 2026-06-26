import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const migrationsDir = resolve(process.cwd(), "migrations");
const dbPath = resolve(process.cwd(), process.env.DB_PATH ?? "./data/tinynotes.db");

type MigrationRow = {
  version: string;
};

const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  await mkdir(dbDir, { recursive: true });
}

const db = new Database(dbPath, { create: true });

try {
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = new Set(
    db
      .query<MigrationRow, []>("SELECT version FROM schema_migrations ORDER BY version ASC")
      .all()
      .map((row) => row.version),
  );

  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  for (const file of migrationFiles) {
    if (applied.has(file)) {
      console.log(`Skipping ${file}`);
      continue;
    }

    const sql = await readFile(join(migrationsDir, file), "utf8");

    try {
      db.exec("BEGIN;");
      db.exec(sql);
      db.query("INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)").run(
        file,
        new Date().toISOString(),
      );
      db.exec("COMMIT;");
      console.log(`Applied ${file}`);
    } catch (error) {
      db.exec("ROLLBACK;");
      console.error(`Failed to apply ${file}`);
      throw error;
    }
  }
} finally {
  db.close();
}
