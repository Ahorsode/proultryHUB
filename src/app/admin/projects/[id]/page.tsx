import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CurrencyCircleDollar,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import { FarmPerformance } from "@/components/admin/farm-performance";
import { FarmPerformanceSkeleton } from "@/components/admin/farm-performance-skeleton";
import { AddExpenseForm, AddPaymentForm } from "@/components/admin/ledger-forms";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectStatusForm } from "@/components/admin/project-status-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProject } from "@/lib/data";
import { formatCurrency, formatDate, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const remainingBudget = Math.max(0, project.budget_total - Number(project.amount_spent ?? 0));
  const spentPercent = Math.min(100, Math.round((Number(project.amount_spent ?? 0) / project.budget_total) * 100));

  return (
    <>
      <PageHeader
        title={project.customer_name}
        description={`${project.regions?.name} · ${project.flock_size.toLocaleString()} birds · Project ${project.id.slice(0, 8).toUpperCase()}`}
        action={<ProjectStatusForm id={project.id} status={project.status} />}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={<CurrencyCircleDollar size={24} />} label="Project budget" value={formatCurrency(project.budget_total)} />
        <SummaryCard icon={<ArrowDown size={24} />} label="Amount spent" value={formatCurrency(project.amount_spent)} tone="amber" />
        <SummaryCard icon={<ArrowUp size={24} />} label="Amount received" value={formatCurrency(project.amount_received)} tone="green" />
        <SummaryCard icon={<Wallet size={24} />} label="Outstanding" value={formatCurrency(project.amount_outstanding)} tone="red" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Budget &amp; expenses</CardTitle>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[#0e2340]" style={{ width: `${spentPercent}%` }} />
              </div>
              <span className="font-mono text-xs">{spentPercent}% spent</span>
            </div>
            <p className="text-sm text-muted-foreground">{formatCurrency(remainingBudget)} remaining</p>
          </CardHeader>
          <CardContent className="grid gap-5 pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(project.expenses ?? []).map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{titleCase(expense.category)}</TableCell>
                    <TableCell className="text-xs">{formatDate(expense.date)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatCurrency(expense.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!project.expenses?.length ? <p className="text-sm text-muted-foreground">No expenses recorded.</p> : null}
            <AddExpenseForm projectId={project.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Customer payments</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(project.amount_outstanding)} outstanding against the agreed project budget.
            </p>
          </CardHeader>
          <CardContent className="grid gap-5 pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(project.payments ?? []).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-xs">{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.method ? titleCase(payment.method) : "—"}</TableCell>
                    <TableCell>{payment.note || "—"}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatCurrency(payment.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!project.payments?.length ? <p className="text-sm text-muted-foreground">No payments recorded.</p> : null}
            <AddPaymentForm projectId={project.id} />
          </CardContent>
        </Card>
      </section>

      <div className="mt-4">
        <Suspense fallback={<FarmPerformanceSkeleton />}>
          <FarmPerformance customerName={project.customer_name} />
        </Suspense>
      </div>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "amber" | "green" | "red";
}) {
  const colors = {
    default: "text-foreground",
    amber: "text-amber-700",
    green: "text-green-700",
    red: "text-red-700",
  };
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="grid size-11 place-items-center rounded-md bg-muted">{icon}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className={`mt-2 font-mono text-xl font-bold ${colors[tone]}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
