"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ProjectStatus } from "@/lib/types";
import { titleCase } from "@/lib/utils";

const colors: Record<ProjectStatus, string> = {
  registered: "#c91818",
  in_progress: "#d99a0b",
  stocked: "#1768a9",
  complete: "#3d7b27",
};

export function ProjectStatusChart({
  counts,
}: {
  counts: Record<ProjectStatus, number>;
}) {
  const data = (Object.entries(counts) as [ProjectStatus, number][]).map(([name, value]) => ({
    name,
    value,
  }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid items-center gap-3 sm:grid-cols-[160px_1fr]">
      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={48} outerRadius={68} strokeWidth={0}>
              {data.map((item) => (
                <Cell key={item.name} fill={colors[item.name]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, "Projects"]}
              contentStyle={{ borderRadius: 6, borderColor: "#dfdbd2", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <strong className="text-2xl leading-none">{total}</strong>
          <span className="mt-1 text-[10px] font-semibold uppercase text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="grid grid-cols-[10px_1fr_auto] items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: colors[item.name] }} />
              <span>{titleCase(item.name)}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {item.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
