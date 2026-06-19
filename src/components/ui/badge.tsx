import { type HTMLAttributes } from "react";
import { cn, titleCase } from "@/lib/utils";

const styles: Record<string, string> = {
  draft: "bg-stone-100 text-stone-700",
  sent: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-700",
  registered: "bg-red-100 text-red-700",
  in_progress: "bg-amber-100 text-amber-800",
  stocked: "bg-blue-100 text-blue-800",
  complete: "bg-green-100 text-green-800",
};

export function StatusBadge({
  status,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
        styles[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    >
      {titleCase(status)}
    </span>
  );
}
