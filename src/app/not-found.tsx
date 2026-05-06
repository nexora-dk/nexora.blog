import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 px-5 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">404</p>
        <h1 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight">页面走丢了</h1>
        <p className="text-neutral-600 dark:text-neutral-300">你访问的页面不存在，或者之后才会被写出来。</p>
        <Link href="/" className="inline-flex rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">
          回到首页
        </Link>
      </div>
    </main>
  );
}
