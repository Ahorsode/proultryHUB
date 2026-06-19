import Link from "next/link";
import {
  ArrowRight,
  Bird,
  Buildings,
  CheckCircle,
  Warehouse,
} from "@phosphor-icons/react/dist/ssr";
import { PublicEstimator } from "@/components/public-estimator";
import { Button } from "@/components/ui/button";

export default function PublicEstimatePage() {
  return (
    <main className="min-h-screen bg-[#f6f1e7]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-[#171c1d] text-[#dda21f]">
            <Warehouse size={24} weight="bold" />
          </span>
          <span>
            <strong className="block leading-tight">PoultryHub Ghana</strong>
            <span className="text-xs text-muted-foreground">Build. Stock. Grow.</span>
          </span>
        </Link>
        <Button asChild variant="outline">
          <Link href="/admin">Owner Dashboard</Link>
        </Button>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#a36a00]">
            Poultry farm construction in Ghana
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            From open land to a farm ready for birds.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f625c]">
            We plan, build, equip, and stock practical poultry facilities sized around your flock and your region.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-[#3f433e] sm:grid-cols-3">
            {[
              [Buildings, "Purpose-built housing"],
              [CheckCircle, "Water & electrical systems"],
              [Bird, "Ready for stocking"],
            ].map(([Icon, label]) => (
              <div key={String(label)} className="flex items-center gap-2 border-t border-[#d8d0c0] pt-3">
                <Icon size={20} className="text-[#a36a00]" />
                <span>{String(label)}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/customer" className="flex items-center gap-2 text-sm font-semibold text-[#77500b]">
              Future customer portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <PublicEstimator />
      </section>

      <footer className="border-t border-[#d8d0c0] px-5 py-6 text-center text-xs text-muted-foreground">
        PoultryHub Ghana · Rough estimates do not replace a detailed site assessment.
      </footer>
    </main>
  );
}
