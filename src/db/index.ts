import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(path.join(dataDir, "portfolio.db"));
sqlite.pragma("journal_mode = WAL");

const ensureProjectMediaColumns = () => {
  const columns = sqlite.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>;
  const existing = new Set(columns.map((col) => col.name));

  if (!existing.has("gallery_images")) {
    sqlite.exec('ALTER TABLE projects ADD COLUMN gallery_images TEXT NOT NULL DEFAULT "[]";');
  }

  if (!existing.has("video_url")) {
    sqlite.exec('ALTER TABLE projects ADD COLUMN video_url TEXT;');
  }
};

ensureProjectMediaColumns();

export const db = drizzle(sqlite, { schema });
