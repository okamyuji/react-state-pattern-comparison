import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { User } from "../src/types.js";

function loadDb(): { users: User[] } {
  const raw = readFileSync(resolve(__dirname, "..", "db.json"), "utf-8");
  return JSON.parse(raw);
}

describe("db.json", () => {
  const db = loadDb();

  it("has a users array", () => {
    expect(Array.isArray(db.users)).toBe(true);
  });

  it("contains 5 users", () => {
    expect(db.users).toHaveLength(5);
  });

  it("each user has required fields with correct types", () => {
    for (const user of db.users) {
      expect(typeof user.id).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(typeof user.department).toBe("string");
    }
  });

  it("all user IDs are unique", () => {
    const ids = db.users.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all emails are valid format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const user of db.users) {
      expect(user.email).toMatch(emailRegex);
    }
  });
});
