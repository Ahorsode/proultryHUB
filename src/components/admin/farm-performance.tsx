import {
  Bird,
  ClockCounterClockwise,
  Egg,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { getFarmPerformanceSummary } from "@/lib/external-farm-data";

export async function FarmPerformance({ customerName }: { customerName: string }) {
  const summary = await getFarmPerformanceSummary(customerName);

  return (
    <section className="rounded-lg border border-blue-200 bg-[#f4f8fb] p-5">
      <div className="flex flex-col gap-2 border-b border-blue-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-900">
            <ShieldCheck size={22} weight="fill" />
            <h2 className="font-semibold">Farm Performance</h2>
          </div>
          <p className="mt-1 text-sm text-blue-800/70">From Poultry Management System · read-only</p>
        </div>
        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">External system</span>
      </div>

      {!summary ? (
        <div className="py-8 text-sm text-blue-900/70">
          No farm performance data is available yet. This is expected before project handover and stocking.
        </div>
      ) : (
        <div className="grid gap-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Bird size={22} />} label="Current bird count" value={summary.currentBirdCount.toLocaleString()} />
          <Metric icon={<Bird size={22} weight="fill" />} label="Stocked bird count" value={summary.stockedBirdCount.toLocaleString()} />
          <Metric icon={<ShieldCheck size={22} />} label="Mortality rate" value={`${summary.mortalityRate}%`} />
          {summary.eggProduction !== undefined ? (
            <Metric icon={<Egg size={22} />} label="Egg production" value={summary.eggProduction.toLocaleString()} />
          ) : (
            <Metric icon={<Egg size={22} />} label="Egg production" value="Not applicable" />
          )}
        </div>
      )}

      {summary ? (
        <p className="flex items-center gap-2 border-t border-blue-200 pt-3 text-xs text-blue-900/60">
          <ClockCounterClockwise size={15} />
          Last updated {new Date(summary.lastUpdated).toLocaleString("en-GH")}
        </p>
      ) : null}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-blue-700">{icon}</div>
      <p className="text-xs font-medium uppercase tracking-wide text-blue-900/60">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-blue-950">{value}</p>
    </div>
  );
}
