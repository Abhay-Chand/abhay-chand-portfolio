import { db } from "@/db";
import {
  profile,
  experiences,
  projects,
  skillGroups,
  certifications,
  achievements,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getProfile() {
  const rows = db.select().from(profile).limit(1).all();
  const row = rows[0];
  if (!row) return null;
  return {
    ...row,
    focusAreas: JSON.parse(row.focusAreas) as string[],
  };
}

export async function getPublishedExperiences() {
  const rows = db
    .select()
    .from(experiences)
    .where(eq(experiences.published, true))
    .orderBy(asc(experiences.sortOrder))
    .all();
  return rows.map((r) => ({
    ...r,
    highlights: JSON.parse(r.highlights) as string[],
  }));
}

export async function getPublishedProjects() {
  const rows = db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder))
    .all();
  return rows.map((r) => ({
    ...r,
    techStack: JSON.parse(r.techStack) as string[],
    links: JSON.parse(r.links) as { github?: string; live?: string; other?: string },
  }));
}

export async function getProjectBySlug(slug: string) {
  const rows = db.select().from(projects).where(eq(projects.slug, slug)).all();
  const row = rows[0];
  if (!row || !row.published) return null;
  return {
    ...row,
    techStack: JSON.parse(row.techStack) as string[],
    links: JSON.parse(row.links) as { github?: string; live?: string; other?: string },
  };
}

export async function getPublishedSkillGroups() {
  const rows = db
    .select()
    .from(skillGroups)
    .where(eq(skillGroups.published, true))
    .orderBy(asc(skillGroups.sortOrder))
    .all();
  return rows.map((r) => ({
    ...r,
    skills: JSON.parse(r.skills) as string[],
  }));
}

export async function getPublishedCertifications() {
  return db
    .select()
    .from(certifications)
    .where(eq(certifications.published, true))
    .orderBy(asc(certifications.sortOrder))
    .all();
}

export async function getPublishedAchievements() {
  return db
    .select()
    .from(achievements)
    .where(eq(achievements.published, true))
    .orderBy(asc(achievements.sortOrder))
    .all();
}
