import Link from "next/link";
import { notFound } from "next/navigation";
import { noteItems } from "@/components/pages/notes/notes-data";
import { PageShell } from "@/components/ui/page-shell";

type NotesDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getNoteSlug(href: string) {
  return href.split("/").filter(Boolean).at(-1);
}

export function generateStaticParams() {
  return noteItems.map((note) => ({ slug: getNoteSlug(note.href) }));
}

export default async function NotesDetailPage({ params }: NotesDetailPageProps) {
  const { slug } = await params;
  const note = noteItems.find((item) => getNoteSlug(item.href) === slug);

  if (!note) {
    notFound();
  }

  return (
    <PageShell title={note.title} description={note.description} hideHeader>
      <article className="space-y-8 pt-2">
        <Link href="/notes" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950 dark:text-neutral-400 dark:hover:text-neutral-50">
          返回手记
        </Link>

        <header className="rounded-[2rem] border border-neutral-200/60 bg-white/70 p-6 shadow-[0_1px_24px_rgba(0,0,0,0.035)] backdrop-blur md:p-8 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_56px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-neutral-400">
            <Link href={`/notes?column=${note.column}`} className="rounded-full border border-zinc-200/80 bg-zinc-50/80 px-3 py-1 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:text-neutral-100">
              {note.columnLabel}
            </Link>
            {note.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-zinc-200/70 px-3 py-1 dark:border-white/10">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <h1 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight text-zinc-950 md:text-5xl dark:text-neutral-50">{note.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-zinc-500 md:text-lg dark:text-neutral-400">{note.description}</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-zinc-400 dark:text-neutral-500">
            <span>{note.publishedAt}</span>
            {note.mood ? <span>{note.mood}</span> : null}
            {note.location ? <span>{note.location}</span> : null}
            <span>{note.views} 次阅读</span>
            <span>{note.likes} 喜欢</span>
          </div>
        </header>

        <section className="rounded-[2rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-sm leading-7 text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">
          这篇手记的详情内容还在整理中，当前先保留数据驱动的详情页入口。
        </section>
      </article>
    </PageShell>
  );
}
