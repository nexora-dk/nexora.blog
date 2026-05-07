"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type ArticleCodeBlockProps = {
  code: string;
  language?: string;
};

type CodeToken = {
  text: string;
  kind?: "keyword" | "string" | "comment" | "number" | "function";
};

const keywordPattern = /\b(?:async|await|break|case|catch|class|const|continue|default|else|export|for|from|function|if|import|let|new|return|switch|this|throw|try|typeof|var|while|yield)\b/g;
const stringPattern = /(["'`])(?:\\.|(?!\1)[^\\])*\1/g;
const commentPattern = /\/\/.*|\/\*[\s\S]*?\*\//g;
const numberPattern = /\b\d+(?:\.\d+)?\b/g;
const functionPattern = /\b([a-zA-Z_$][\w$]*)(?=\s*\()/g;

function collectMatches(line: string, pattern: RegExp, kind: CodeToken["kind"]) {
  return Array.from(line.matchAll(pattern)).map((match) => ({
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    kind,
  }));
}

function tokenizeLine(line: string) {
  const matches = [
    ...collectMatches(line, stringPattern, "string"),
    ...collectMatches(line, commentPattern, "comment"),
    ...collectMatches(line, keywordPattern, "keyword"),
    ...collectMatches(line, numberPattern, "number"),
    ...collectMatches(line, functionPattern, "function"),
  ]
    .sort((first, second) => first.start - second.start || second.end - first.end)
    .reduce<Array<{ start: number; end: number; kind: CodeToken["kind"] }>>((tokens, match) => {
      const overlaps = tokens.some((token) => match.start < token.end && match.end > token.start);
      return overlaps ? tokens : [...tokens, match];
    }, []);

  const tokens: CodeToken[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      tokens.push({ text: line.slice(cursor, match.start) });
    }

    tokens.push({ text: line.slice(match.start, match.end), kind: match.kind });
    cursor = match.end;
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor) });
  }

  return tokens.length ? tokens : [{ text: line || " " }];
}

function getTokenClassName(kind: CodeToken["kind"]) {
  if (kind === "keyword") {
    return "text-rose-500 dark:text-rose-300";
  }

  if (kind === "string") {
    return "text-emerald-600 dark:text-emerald-300";
  }

  if (kind === "comment") {
    return "text-zinc-400 dark:text-neutral-500";
  }

  if (kind === "number") {
    return "text-sky-600 dark:text-sky-300";
  }

  if (kind === "function") {
    return "text-violet-600 dark:text-violet-300";
  }

  return "text-zinc-800 dark:text-neutral-100";
}

export function ArticleCodeBlock({ code, language }: ArticleCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  async function copyCode() {
    await navigator.clipboard.writeText(code.replace(/\n$/, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <figure className="group/code my-5 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/85 shadow-sm shadow-zinc-950/[0.03] dark:border-white/10 dark:bg-[#101010]/90 dark:shadow-black/20">
      <figcaption className="flex items-center justify-between border-b border-zinc-200/70 px-4 py-2 text-xs font-medium text-zinc-400 dark:border-white/10 dark:text-neutral-500">
        <span>{language || "text"}</span>
        <button type="button" onClick={copyCode} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-2.5 py-1 text-xs text-zinc-500 opacity-100 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100 md:opacity-0 md:group-hover/code:opacity-100" aria-label="复制代码">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 text-[15px] leading-6 [tab-size:2]">
        <code>
          {lines.map((line, lineIndex) => (
            <span key={`${line}-${lineIndex}`} className="block">
              {tokenizeLine(line).map((token, tokenIndex) => (
                <span key={`${token.text}-${tokenIndex}`} className={getTokenClassName(token.kind)}>
                  {token.text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
