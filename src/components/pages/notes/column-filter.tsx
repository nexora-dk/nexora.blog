import Link from "next/link";
import type { NoteColumn } from "./notes-data";
import { noteColumns } from "./notes-data";

type ColumnFilterProps = {
  activeColumn?: NoteColumn;
};

function getFilterClassName(active: boolean) {
  return active
    ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
    : "border-neutral-200/70 bg-white/65 text-neutral-500 hover:border-neutral-300 hover:text-neutral-950 dark:border-white/10 dark:bg-neutral-950/35 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100";
}

export function ColumnFilter({ activeColumn }: ColumnFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/notes" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getFilterClassName(!activeColumn)}`}>
        全部
      </Link>
      {noteColumns.map((column) => (
        <Link key={column.value} href={`/notes?column=${column.value}`} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getFilterClassName(activeColumn === column.value)}`}>
          {column.label}
        </Link>
      ))}
    </div>
  );
}
