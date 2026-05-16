import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { CommentMarkdown } from "./comment-markdown";

type EditorMode = "write" | "preview";

type CommentEditorProps = {
  value: string;
  disabled: boolean;
  placeholder: string;
  onChange: (value: string) => void;
};

export type CommentEditorHandle = {
  focusWrite: () => void;
  insertText: (text: string) => void;
};

export const CommentEditor = forwardRef<
  CommentEditorHandle,
  CommentEditorProps
>(function CommentEditor({ value, disabled, placeholder, onChange }, ref) {
  const [mode, setMode] = useState<EditorMode>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focusWrite() {
      setMode("write");
      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    },
    insertText(text) {
      setMode("write");

      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? value.length;
      const end = textarea?.selectionEnd ?? value.length;
      const nextValue = `${value.slice(0, start)}${text}${value.slice(end)}`;
      const nextCursorPosition = start + text.length;

      onChange(nextValue);

      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition);
      });
    },
  }));

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-zinc-200/70 px-4 py-2 text-xs dark:border-white/10">
        <button
          type="button"
          onClick={() => setMode("write")}
          className={`rounded-full px-3 py-1.5 font-medium transition ${
            mode === "write"
              ? "bg-zinc-950 text-white dark:bg-neutral-100 dark:text-neutral-950"
              : "text-zinc-500 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          写评论
        </button>

        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`rounded-full px-3 py-1.5 font-medium transition ${
            mode === "preview"
              ? "bg-zinc-950 text-white dark:bg-neutral-100 dark:text-neutral-950"
              : "text-zinc-500 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          预览
        </button>
      </div>

      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="h-[120px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-100 dark:placeholder:text-neutral-600"
        />
      ) : (
        <div className="min-h-[120px] px-5 py-4 text-sm leading-7 text-zinc-700 dark:text-neutral-300">
          {value.trim() ? (
            <CommentMarkdown content={value} />
          ) : (
            <p className="text-zinc-400 dark:text-neutral-600">暂无预览内容</p>
          )}
        </div>
      )}
    </div>
  );
});
