import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Single admin user (portfolio owner)
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

// One row: the person themself
export const profile = sqliteTable("profile", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  photoUrl: text("photo_url"),
  resumeUrl: text("resume_url"),
  email: text("email"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  yearsActive: text("years_active"),
  focusAreas: text("focus_areas").notNull().default("[]"), // JSON string[]
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  org: text("org").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"), // null = present
  summary: text("summary").notNull(),
  highlights: text("highlights").notNull().default("[]"), // JSON string[]
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category", { enum: ["ai", "data"] }).notNull(),
  summary: text("summary").notNull(),
  problem: text("problem"),
  solution: text("solution"),
  architecture: text("architecture"),
  outcome: text("outcome"),
  challenges: text("challenges"),
  techStack: text("tech_stack").notNull().default("[]"), // JSON string[]
  links: text("links").notNull().default("{}"), // JSON {github?, live?, other?}
  coverImageUrl: text("cover_image_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const skillGroups = sqliteTable("skill_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  skills: text("skills").notNull().default("[]"), // JSON string[]
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});

export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  dateEarned: text("date_earned"),
  url: text("url"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dateEarned: text("date_earned"),
  url: text("url"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});
