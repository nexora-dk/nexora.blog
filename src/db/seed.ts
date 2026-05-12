import { config } from "dotenv";

config({ path: ".env.local" });

function parseCount(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue.endsWith("k")) {
    return Math.round(Number(normalizedValue.slice(0, -1)) * 1000);
  }

  const count = Number(normalizedValue);
  return Number.isFinite(count) ? count : 0;
}

async function seedContent() {
  const [{ db }, { writings, notes }, { articleItems }, { noteItems }] = await Promise.all([
  import("./db"),
  import("./schemas/schema"),
  import("../components/pages/writing/writing-data"),
  import("../components/pages/notes/notes-data"),
]);


  for (const article of articleItems) {
    const values = {
      slug: article.slug,
      title: article.title,
      description: article.description,
      href: article.href,
      date: article.date,
      category: article.category,
      categoryLabel: article.categoryLabel,
      tags: article.tags,
      readingTime: article.readingTime,
      views: parseCount(article.views),
      likes: parseCount(article.likes),
      modifiedTime: article.modifiedTime,
      contentPath: `data/writing/${article.slug}.md`,
    };

    

    await db
      .insert(writings)
      .values(values)
      .onConflictDoUpdate({
        target: writings.slug,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  for (const note of noteItems) {
  const values = {
    slug: note.href.replace("/notes/", ""),
    title: note.title,
    description: note.description,
    href: note.href,
    date: note.date,
    column: note.column,
    columnLabel: note.columnLabel,
    mood: note.mood,
    location: note.location,
    tags: note.tags,
    publishedAt: note.publishedAt,
    views: parseCount(note.views),
    likes: parseCount(note.likes),
    readingTime: note.readingTime,
    insight: note.description,
    contentPath: `data/notes/${note.href.replace("/notes/", "")}.md`,
  };

  await db
    .insert(notes)
    .values(values)
    .onConflictDoUpdate({
      target: notes.slug,
      set: {
        ...values,
        updatedAt: new Date(),
      },
    });
}


  console.log(`Seeded ${articleItems.length} writings and ${noteItems.length} notes.`);

}

seedContent().catch((error) => {
  console.error("Failed to seed writings:", error);
  process.exit(1);
});
