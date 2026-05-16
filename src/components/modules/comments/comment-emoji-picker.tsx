"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Smile } from "lucide-react";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

type CommentEmojiPickerProps = {
  disabled?: boolean;
  onEmojiSelect: (emoji: string) => void;
};

type PickerPosition = {
  left: number;
  top: number;
};

const pickerWidth = 340;
const pickerHeight = 420;
const pickerGap = 8;
const viewportPadding = 16;

export function CommentEmojiPicker({
  disabled,
  onEmojiSelect,
}: CommentEmojiPickerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PickerPosition | null>(null);

  function updatePosition() {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const maxLeft = window.innerWidth - pickerWidth - viewportPadding;
    const nextLeft = Math.min(
      Math.max(rect.left, viewportPadding),
      Math.max(maxLeft, viewportPadding),
    );
    const belowTop = rect.bottom + pickerGap;
    const aboveTop = rect.top - pickerHeight - pickerGap;
    const hasRoomBelow = belowTop + pickerHeight <= window.innerHeight - viewportPadding;

    setPosition({
      left: nextLeft,
      top: hasRoomBelow ? belowTop : Math.max(aboveTop, viewportPadding),
    });
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  function handleEmojiClick(emojiData: EmojiClickData) {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        className="grid size-8 place-items-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-45 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
        aria-label="选择表情"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Smile className="size-4" />
      </button>

      {isOpen && position
        ? createPortal(
            <div
              className="fixed z-200 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-950/10 dark:border-white/10 dark:bg-neutral-950 dark:shadow-black/30"
              style={{ left: position.left, top: position.top }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={pickerWidth}
                height={pickerHeight}
                lazyLoadEmojis
                searchPlaceHolder="搜索表情"
                previewConfig={{ showPreview: false }}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
