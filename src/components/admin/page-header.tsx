import Link from "next/link";
import { ArrowLeft, CalendarBlank, MapPin, Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        {back ? (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={16} />
            {back.label}
          </Link>
        ) : null}
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
          {formatDate(new Date().toISOString())}
        </div>
        {action === undefined ? (
          <Button asChild>
            <Link href="/admin/quotes?new=1">
              <Plus size={18} weight="bold" />
              New Quote
            </Link>
          </Button>
        ) : (
          action
        )}
      </div>
    </header>
  );
}
