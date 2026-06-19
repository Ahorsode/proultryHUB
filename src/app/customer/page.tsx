import Link from "next/link";
import {
  ArrowRight,
  Bird,
  ChartLineUp,
  ClockCountdown,
  Warehouse,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function CustomerPortalPage() {
  return (
    <main className="min-h-screen bg-[#151a1c] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-[#d99a19] text-[#151a1c]">
            <Warehouse size={24} weight="bold" />
          </span>
          <strong>PoultryHub Ghana</strong>
        </Link>
        <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
          <Link href="/admin">Owner Dashboard</Link>
        </Button>
      </nav>

      <section className="mx-auto flex max-w-5xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-36">
        <span className="rounded bg-[#d99a19]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#efb640]">
          Customer portal · coming soon
        </span>
        <h1 className="mt-7 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Manage your farm after handover.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          Customers will be able to sign in, follow their flock, review mortality and production trends,
          and stay connected to the day-to-day health of the farm we built.
        </p>

        <div className="mt-12 grid w-full gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 text-left md:grid-cols-3">
          {[
            [Bird, "Flock visibility", "See current bird counts and stocking history."],
            [ChartLineUp, "Performance trends", "Understand mortality and production at a glance."],
            [ClockCountdown, "Built for later", "This portal will connect when customer access is ready."],
          ].map(([Icon, title, copy]) => (
            <article key={String(title)} className="bg-[#1a2021] p-6">
              <Icon size={26} className="text-[#e6a624]" />
              <h2 className="mt-5 font-semibold">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{String(copy)}</p>
            </article>
          ))}
        </div>

        <Button asChild size="lg" className="mt-10">
          <Link href="/">
            Get a public estimate <ArrowRight size={18} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
