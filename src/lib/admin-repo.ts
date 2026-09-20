import { db } from "@/db";
import {
  profile,
  experiences,
  projects,
  skillGroups,
  certifications,
  achievements,
} from "@/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

type ResourceConfig = {
  table: SQLiteTable;
  jsonFields: string[];
  orderable: boolean;
  singleton: boolean;
};

export const RESOURCES: Record<string, ResourceConfig> = {
  profile: { table: profile, jsonFields: ["focusAreas"], orderable: false, singleton: true },
  experience: { table: experiences, jsonFields: ["highlights"], orderable: true, singleton: false },
  projects: { table: projects, jsonFields: ["techStack", "links"], orderable: true, singleton: false },
  skills: { table: skillGroups, jsonFields: ["skills"], orderable: true, singleton: false },
  certifications: { table: certifications, jsonFields: [], orderable: true, singleton: false },
  achievements: { table: achievements, jsonFields: [], orderable: true, singleton: false },
};

export function getResourceConfig(resource: string) {
  const config = RESOURCES[resource];
  if (!config) throw new Error(`Unknown resource: ${resource}`);
  return config;
}

function parseRow(row: Record<string, unknown>, jsonFields: string[]) {
  const parsed: Record<string, unknown> = { ...row };
  for (const field of jsonFields) {
    if (typeof parsed[field] === "string") {
      try {
        parsed[field] = JSON.parse(parsed[field] as string);
      } catch {
        // leave as-is if it isn't valid JSON
      }
    }
  }
  return parsed;
}

function serializeInput(input: Record<string, unknown>, jsonFields: string[]) {
  const out: Record<string, unknown> = { ...input };
  for (const field of jsonFields) {
    if (field in out && typeof out[field] !== "string") {
      out[field] = JSON.stringify(out[field] ?? (field === "links" ? {} : []));
    }
  }
  return out;
}

export function listResource(resource: string) {
  const { table, jsonFields, orderable } = getResourceConfig(resource);
  let rows;
  if (orderable) {
    rows = db.select().from(table).orderBy(asc(sql`sort_order`)).all() as Record<string, unknown>[];
  } else {
    rows = db.select().from(table).all() as Record<string, unknown>[];
  }
  return rows.map((r) => parseRow(r, jsonFields));
}

export function getResourceById(resource: string, id: string) {
  const { table, jsonFields } = getResourceConfig(resource);
  const rows = db
    .select()
    .from(table)
    .where(eq((table as unknown as { id: typeof profile.id }).id, id))
    .all() as Record<string, unknown>[];
  const row = rows[0];
  return row ? parseRow(row, jsonFields) : null;
}

export function createResource(resource: string, input: Record<string, unknown>) {
  const { table, jsonFields, singleton } = getResourceConfig(resource);
  if (singleton) {
    throw new Error(`${resource} is a singleton and cannot be created again`);
  }
  const now = new Date();
  const id = randomUUID();
  const data = serializeInput(input, jsonFields);
  const insertData: Record<string, unknown> = {
    ...data,
    id,
    createdAt: "createdAt" in data ? data.createdAt : now,
    updatedAt: now,
  };
  db.insert(table).values(insertData as never).run();
  return getResourceById(resource, id);
}

export function updateResource(resource: string, id: string, input: Record<string, unknown>) {
  const { table, jsonFields, singleton } = getResourceConfig(resource);
  const data = serializeInput(input, jsonFields);
  const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
  delete updateData.id;
  delete updateData.createdAt;

  if (singleton) {
    // Singleton resources (profile) are updated by their single row's id.
    db.update(table)
      .set(updateData as never)
      .where(eq((table as unknown as { id: typeof profile.id }).id, id))
      .run();
  } else {
    db.update(table)
      .set(updateData as never)
      .where(eq((table as unknown as { id: typeof profile.id }).id, id))
      .run();
  }
  return getResourceById(resource, id);
}

export function deleteResource(resource: string, id: string) {
  const { table, singleton } = getResourceConfig(resource);
  if (singleton) throw new Error(`${resource} cannot be deleted`);
  db.delete(table)
    .where(eq((table as unknown as { id: typeof profile.id }).id, id))
    .run();
}

export function reorderResource(resource: string, orderedIds: string[]) {
  const { table, orderable } = getResourceConfig(resource);
  if (!orderable) throw new Error(`${resource} does not support ordering`);
  orderedIds.forEach((id, index) => {
    db.update(table)
      .set({ sortOrder: index } as never)
      .where(eq((table as unknown as { id: typeof profile.id }).id, id))
      .run();
  });
}
