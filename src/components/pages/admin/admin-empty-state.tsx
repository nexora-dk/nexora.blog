type AdminEmptyStateProps = {
  children: React.ReactNode;
};

export function AdminEmptyState({ children }: AdminEmptyStateProps) {
  return (
    <div className="flex min-h-[42vh] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
      {children}
    </div>
  );
}
