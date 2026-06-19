import Link from "next/link";
import { CalendarBlank, MapPin, Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden h-10 items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground md:flex">
          <MapPin size={18} />
          All regions
        </div>
        <div className="hidden h-10 items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground md:flex">
          <CalendarBlank size={18} />
          19 Jun 2026
        </div>
        {action ?? (
          <Button asChild>
            <Link href="/admin/quotes?new=1">
              <Plus size={18} weight="bold" />
              New Quote
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
