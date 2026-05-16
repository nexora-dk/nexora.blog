import { and, asc, eq } from "drizzle-orm";

import { db } from "../db";
import { projects } from "../schemas/schema";
import { retryDatabaseRead } from "./retry";

export type ProjectItem = {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  tags: string[];
  href?: string;
  repoHref?: string;
  developmentTime: string;
  coverImageUrl?: string;
  coverBlobKey: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  sourceKey: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminProjectItem = ProjectItem;

type ProjectInput = {
  title: string;
  description: string;
  status: string;
  category: string;
  tags: string[];
  href: string | null;
  repoHref: string | null;
  developmentTime: string;
  coverImageUrl: string | null;
  coverBlobKey: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  sourceKey?: string | null;
};

function mapProject(row: typeof projects.$inferSelect): ProjectItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    category: row.category,
    tags: row.tags,
    href: row.href ?? undefined,
    repoHref: row.repoHref ?? undefined,
    developmentTime: row.developmentTime,
    coverImageUrl: row.coverImageUrl ?? undefined,
    coverBlobKey: row.coverBlobKey,
    isFeatured: row.isFeatured,
    isVisible: row.isVisible,
    sortOrder: row.sortOrder,
    sourceKey: row.sourceKey,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getProjects(): Promise<ProjectItem[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select()
      .from(projects)
      .where(eq(projects.isVisible, true))
      .orderBy(asc(projects.sortOrder), asc(projects.id)),
  );

  return rows.map(mapProject);
}

export async function getFeaturedProjects(limit = 2): Promise<ProjectItem[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select()
      .from(projects)
      .where(and(eq(projects.isVisible, true), eq(projects.isFeatured, true)))
      .orderBy(asc(projects.sortOrder), asc(projects.id))
      .limit(limit),
  );

  return rows.map(mapProject);
}

export async function getAdminProjects(): Promise<AdminProjectItem[]> {
  const rows = await retryDatabaseRead(() =>
    db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id)),
  );

  return rows.map(mapProject);
}

export async function getAdminProjectById(id: number) {
  const [project] = await retryDatabaseRead(() =>
    db.select().from(projects).where(eq(projects.id, id)).limit(1),
  );

  return project ? mapProject(project) : undefined;
}

export async function createProject(input: ProjectInput) {
  const [project] = await db
    .insert(projects)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning({ id: projects.id });

  return project;
}

export async function updateProjectById(id: number, input: ProjectInput) {
  const [project] = await db
    .update(projects)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  return project;
}

export async function deleteProjectById(id: number) {
  const [project] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  return project;
}
