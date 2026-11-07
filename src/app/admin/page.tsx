import Link from "next/link";
import {
  ArrowRight,
  ClipboardText,
  CurrencyCircleDollar,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectStatusChart } from "@/components/admin/dashboard-charts";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardData } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getDashboardData();

  return (
    <>
      <PageHeader
        title="Good morning, Akosua"
        description="Here’s what’s happening with your construction projects today."
      />

      <section className="grid gap-3 xl:grid-cols-12">
        <Card className="xl:col-span-3">
          <CardContent className="flex min-h-52 flex-col p-5">
            <div className="flex items-start gap-4">
              <div className="grid size-12 place-items-center rounded-md bg-[#f5f0e5]">
                <ClipboardText size={25} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide">Active projects</p>
                <strong className="mt-2 block font-mono text-3xl">{data.activeProjects}</strong>
                <p className="mt-1 text-sm text-muted-foreground">
                  Across {data.activeRegionCount} {data.activeRegionCount === 1 ? "region" : "regions"}
                </p>
              </div>
            </div>
            <Link href="/admin/projects" className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
              View all projects <ArrowRight size={16} />
            </Link>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardContent className="flex min-h-52 flex-col p-5">
            <div className="flex items-start gap-4">
              <div className="grid size-12 place-items-center rounded-md bg-[#f5f0e5]">
                <CurrencyCircleDollar size={26} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide">Total outstanding</p>
                <strong className="mt-2 block font-mono text-2xl text-red-700">
                  {formatCurrency(data.outstanding)}
                </strong>
                <p className="mt-1 text-sm text-muted-foreground">Across active customer accounts</p>
              </div>
            </div>
            <Link
              href="/admin/projects?sort=outstanding"
              className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary"
            >
              View receivables <ArrowRight size={16} />
            </Link>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader className="pb-0">
            <CardTitle className="text-xs uppercase tracking-wide">Projects by status</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart counts={data.statusCounts} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardContent className="flex min-h-52 flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wide">Quotes this period</p>
            <strong className="mt-4 font-mono text-4xl">{data.quotes.length}</strong>
            <p className="mt-2 text-sm text-green-700">Ready for owner follow-up</p>
            <Link href="/admin/quotes" className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
              View quotes <ArrowRight size={16} />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-sm uppercase tracking-wide">Budget vs spend (active projects)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>% spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.projects
                  .filter((project) => project.status !== "complete")
                  .slice(0, 5)
                  .map((project) => {
                    const percent = project.budget_total > 0
                      ? Math.min(100, Math.round(((project.amount_spent ?? 0) / project.budget_total) * 100))
                      : 0;
                    return (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Link href={`/admin/projects/${project.id}`} className="font-medium hover:text-primary">
                            {project.customer_name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{formatCurrency(project.budget_total)}</TableCell>
                        <TableCell className="font-mono text-xs">{formatCurrency(project.amount_spent)}</TableCell>
                        <TableCell>
                          <div className="flex min-w-32 items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-[#0e2340]"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="w-9 font-mono text-xs">{percent}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-red-700">Attention required</CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-4">
            <Link
              href="/admin/projects?sort=outstanding"
              className="flex items-start gap-3 py-4 first:pt-0 hover:text-primary"
            >
              <WarningCircle size={24} weight="fill" className="shrink-0 text-red-700" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Outstanding balances</p>
                <p className="text-xs text-muted-foreground">Customer payment follow-up required</p>
              </div>
              <span className="font-mono text-xs font-semibold text-red-700">
                {formatCurrency(data.outstanding)}
              </span>
            </Link>
            <Link href="/admin/projects?sort=budget" className="flex items-start gap-3 py-4 hover:text-primary">
              <WarningCircle size={24} weight="fill" className="shrink-0 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Budget risk &gt; 80%</p>
                <p className="text-xs text-muted-foreground">
                  {data.budgetRiskCount} {data.budgetRiskCount === 1 ? "project" : "projects"}
                </p>
              </div>
            </Link>
            <Link href="/admin/projects" className="flex items-center gap-2 pt-4 text-sm font-semibold text-primary">
              Review projects <ArrowRight size={16} />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mt-3 grid gap-3 2xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-sm uppercase tracking-wide">Recent quotes</CardTitle>
            <Link href="/admin/quotes" className="text-xs font-semibold text-primary">View all quotes</Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Flock</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Link href={`/admin/quotes/${quote.id}`} className="font-medium hover:text-primary">
                        {quote.customer_name || "Unnamed prospect"}
                      </Link>
                    </TableCell>
                    <TableCell>{quote.regions?.name}</TableCell>
                    <TableCell className="font-mono text-xs">{quote.flock_size.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">{formatCurrency(quote.cost_total)}</TableCell>
                    <TableCell><StatusBadge status={quote.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-sm uppercase tracking-wide">Recent projects</CardTitle>
            <Link href="/admin/projects" className="text-xs font-semibold text-primary">View all projects</Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Flock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link href={`/admin/projects/${project.id}`} className="font-medium hover:text-primary">
                        {project.customer_name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.regions?.name}</TableCell>
                    <TableCell className="font-mono text-xs">{project.flock_size.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={project.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(project.updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <footer className="py-7 text-center text-xs text-muted-foreground">PoultryHub Ghana © 2026</footer>
    </>
  );
}
