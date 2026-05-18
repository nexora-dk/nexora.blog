type PageLoadingProps = {
  fixed?: boolean;
  label?: string;
  text?: string;
};

export function PageLoading({
  fixed = false,
  label = "页面加载中，请稍候",
  text = "马上好，真的马上",
}: PageLoadingProps) {
  return (
    <div
      className={`${fixed ? "fixed inset-0 z-50" : "min-h-[50vh]"} flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all dark:bg-neutral-950/70`}
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-neutral-200/40 blur-2xl dark:bg-white/10" />
          <div className="absolute h-24 w-24 transform-gpu animate-[loadingRipple_1.8s_ease-out_infinite] rounded-full border border-neutral-300/80 dark:border-white/20" />
          <div className="absolute h-24 w-24 transform-gpu animate-[loadingRipple_1.8s_ease-out_infinite_0.45s] rounded-full border border-neutral-300/60 dark:border-white/15" />
          <div className="relative h-5 w-5 transform-gpu animate-[loadingDot_1.4s_ease-in-out_infinite] rounded-full bg-neutral-950 shadow-[0_0_30px_rgba(0,0,0,0.18)] dark:bg-white dark:shadow-[0_0_30px_rgba(255,255,255,0.28)]" />
        </div>

        <p className="mt-4 text-xs font-medium tracking-[0.25em] text-neutral-400 motion-safe:animate-[loadingText_1.8s_ease-in-out_infinite] dark:text-neutral-500">
          {text}
        </p>
      </div>
    </div>
  );
}
