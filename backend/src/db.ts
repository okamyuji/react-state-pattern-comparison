import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { User } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadDb(): { users: User[] } {
  const dbPath = resolve(__dirname, "..", "db.json");
  const raw = readFileSync(dbPath, "utf-8");
  return JSON.parse(raw) as { users: User[] };
}
