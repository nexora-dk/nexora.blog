import { MDXRemote } from "next-mdx-remote/rsc";
import { Clock3, Eye, Heart, MapPin, SmilePlus, Timer } from "lucide-react";
import { NoteComments } from "./note-comments";
import { NoteLikeButton } from "./note-like-button";
import { NoteToc } from "./note-toc";
import type { NoteDetail as NoteDetailData } from "./notes-data";

type NoteDetailProps = {
  note: NoteDetailData;
};

function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  return "";
}

const noteHeadingColor = "text-[#151d31] dark:text-neutral-50";
const noteTextColor = "text-[#473d35] dark:text-neutral-100/90";

const mdxComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
    <h1 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-6 text-[2rem] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-7 font-[ui-sans-serif,system-ui,sans-serif] text-[21px] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-2 font-[ui-sans-serif,system-ui,sans-serif] text-[1.28rem] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h3>
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] [text-indent:2em] ${noteTextColor}`} {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className={`list-disc space-y-2 pl-6 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] marker:text-[#d4d4d8] ${noteTextColor}`} {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className={`list-decimal space-y-2 pl-6 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] marker:text-[#a1a1aa] ${noteTextColor}`} {...props} />,
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="pl-1 [&>p]:my-0 [&>p]:[text-indent:0]" {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => <blockquote className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] [text-indent:2em] ${noteTextColor}`} {...props} />,
  a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="font-medium text-[#18181b] underline decoration-[#d4d4d8] underline-offset-4 transition hover:text-[#27272a] hover:decoration-[#a1a1aa] dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:text-white" {...props} />,
  code: (props: React.ComponentPropsWithoutRef<"code">) => <code className="rounded-md bg-[#f2e7dd] px-1.5 py-0.5 text-[0.88em] text-[#5f3f2c] dark:bg-white/10 dark:text-neutral-100" {...props} />,
};

export function NoteDetail({ note }: NoteDetailProps) {
  const metadataItems = [
    { label: "发布日期", value: note.publishedAt, icon: Clock3 },
    note.location ? { label: "地点", value: note.location, icon: MapPin } : null,
    note.mood ? { label: "心情", value: note.mood, icon: SmilePlus } : null,
    { label: "阅读时间", value: note.readingTime, icon: Timer },
    { label: "浏览量", value: note.views, icon: Eye },
    { label: "喜欢", value: note.likes, icon: Heart },
  ].filter((item): item is { label: string; value: string; icon: typeof Clock3 } => item !== null);

  return (
    <article className="relative -mx-5 -mt-28 px-4 pb-20 pt-36 md:-mt-32 md:px-6 md:pt-44 lg:-mx-28 lg:px-8 xl:-mx-80 xl:px-10">
      <div className="relative mx-auto max-w-[82rem]">
        <div className="mx-auto max-w-[820px]">
          <div className="relative min-w-0">
            <div id="note-paper" className="relative z-10 overflow-hidden rounded-[0.35rem] border border-zinc-200/60 bg-[#fdfcfa]/90 shadow-[0_16px_48px_rgba(82,76,70,0.045)] backdrop-blur dark:border-white/8 dark:bg-[#141414]/94 dark:shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
              <div className="pointer-events-none absolute inset-3 rounded-[0.25rem] border border-[#eee8df]/70 dark:border-white/[0.035]" />
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d9cfc1]/80 to-transparent dark:via-white/10" />
              <div className="pointer-events-none absolute left-6 top-6 size-8 border-l border-t border-[#e6ded3] dark:border-white/[0.06]" />
              <div className="pointer-events-none absolute right-6 top-6 size-8 border-r border-t border-[#e6ded3] dark:border-white/[0.06]" />
              <div className="pointer-events-none absolute bottom-6 left-6 size-8 border-b border-l border-[#e6ded3] dark:border-white/[0.06]" />
              <div className="pointer-events-none absolute bottom-6 right-6 size-8 border-b border-r border-[#e6ded3] dark:border-white/[0.06]" />
              <div className="pointer-events-none absolute right-10 top-10 size-1.5 rounded-full bg-emerald-300/45 dark:bg-emerald-300/18" />
              <div className="pointer-events-none absolute bottom-10 left-10 size-1 rounded-full bg-sky-300/45 dark:bg-sky-300/18" />
              <div className="relative z-10 px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16 xl:px-[4.2rem]">
                <header className="space-y-7">
                  <h1 className={`text-balance font-[ui-sans-serif,system-ui,sans-serif] text-[2rem] font-semibold leading-tight tracking-[-0.025em] ${noteHeadingColor}`}>{note.title}</h1>

                  <dl className="flex flex-wrap items-center gap-x-0 gap-y-2 font-[ui-sans-serif,system-ui,sans-serif] text-[13px] font-medium leading-none text-[#7d746b] dark:text-neutral-300/85">
                    {metadataItems.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="inline-flex items-center gap-1.5 border-r border-[#d9d0c7] px-2.5 first:pl-0 last:border-r-0 last:pr-0 dark:border-white/12">
                        <dt className="sr-only">{label}</dt>
                        <Icon className="size-3.5 shrink-0 stroke-[1.7]" />
                        <dd className="whitespace-nowrap">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </header>

                <div id="note-paper-content" className="mt-7 space-y-3">
                  <MDXRemote source={note.content} components={mdxComponents} />
                </div>

                <div className="mt-12 border-t border-zinc-200/60 pt-8 dark:border-white/10">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <p className="text-xs font-medium tracking-[0.18em] text-[#9c8d80] uppercase dark:text-neutral-500">喜欢这篇手记吗</p>
                    <NoteLikeButton noteSlug={note.slug} initialLikes={note.likes} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-[calc(50%+430px)] top-[70px] hidden xl:block">
          <NoteToc items={note.toc} />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[820px]">
        <NoteComments noteTitle={note.title} />
      </div>
    </article>
  );
}
