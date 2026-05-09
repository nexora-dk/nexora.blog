"use client";

// 客户端代码块组件负责展示高亮后的代码行，并提供复制按钮交互。
import { useState } from "react";
import { Check, Copy } from "lucide-react";

// code 是原始代码文本，language 是从 MDX code className 中解析出的语言名。
type ArticleCodeBlockProps = {
  code: string;
  language?: string;
};

// CodeToken 表示一段代码文本及其语法类别，用于映射颜色类名。
type CodeToken = {
  text: string;
  kind?: "keyword" | "string" | "comment" | "number" | "function";
};

// 简易正则集合用于轻量语法着色，不依赖额外高亮库。
const keywordPattern = /\b(?:async|await|break|case|catch|class|const|continue|default|else|export|for|from|function|if|import|let|new|return|switch|this|throw|try|typeof|var|while|yield)\b/g;
const stringPattern = /(["'`])(?:\\.|(?!\1)[^\\])*\1/g;
const commentPattern = /\/\/.*|\/\*[\s\S]*?\*\//g;
const numberPattern = /\b\d+(?:\.\d+)?\b/g;
const functionPattern = /\b([a-zA-Z_$][\w$]*)(?=\s*\()/g;

// 收集某一类正则命中的起止位置，后续再统一去重和排序。
function collectMatches(line: string, pattern: RegExp, kind: CodeToken["kind"]) {
  return Array.from(line.matchAll(pattern)).map((match) => ({
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    kind,
  }));
}

// 把单行代码切分成多个 token；重叠命中时保留更靠前、更长的片段。
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

  // 按命中位置补齐普通文本和高亮文本，保持原始代码顺序不变。
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

  // 空行用一个空格占位，保证每一行都有可渲染高度。
  return tokens.length ? tokens : [{ text: line || " " }];
}

// 根据 token 类型返回对应颜色；未分类文本使用默认正文色。
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

// ArticleCodeBlock 渲染代码容器、语言标签、复制按钮和逐行 token。
export function ArticleCodeBlock({ code, language }: ArticleCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  // 去掉 MDX 代码块末尾额外换行，再按行渲染，避免末尾多出空白行。
  const lines = code.replace(/\n$/, "").split("\n");

  // 复制代码到剪贴板，并在短时间内切换按钮反馈。
  async function copyCode() {
    await navigator.clipboard.writeText(code.replace(/\n$/, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <figure className="group/code my-5 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/85 shadow-sm shadow-zinc-950/[0.03] dark:border-white/10 dark:bg-[#101010]/90 dark:shadow-black/20">
      {/* 顶栏展示语言名和复制按钮；复制按钮在桌面端 hover 时显现。 */}
      <figcaption className="flex items-center justify-between border-b border-zinc-200/70 px-4 py-2 text-xs font-medium text-zinc-400 dark:border-white/10 dark:text-neutral-500">
        <span>{language || "text"}</span>
        <button type="button" onClick={copyCode} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 px-2.5 py-1 text-xs text-zinc-500 opacity-100 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100 md:opacity-0 md:group-hover/code:opacity-100" aria-label="复制代码">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
      </figcaption>
      {/* pre/code 保留代码语义；内部逐行逐 token 渲染以实现轻量高亮。 */}
      <pre className="overflow-x-auto px-4 py-3 text-[15px] leading-6 [tab-size:2]">
        <code>
          {/* 循环每一行，外层 span 设为 block 以保留换行视觉。 */}
          {lines.map((line, lineIndex) => (
            <span key={`${line}-${lineIndex}`} className="block">
              {/* 循环当前行的 token，并按类别应用颜色。 */}
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
