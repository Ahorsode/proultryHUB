import Link from "next/link";
import { FunnelSimple } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/form-controls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjects } from "@/lib/data";
import type { ProjectStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: ProjectStatus; sort?: string }>;
}) {
  const params = await searchParams;
  const projects = await getProjects(params.status);
  const sorted = [...projects].sort((a, b) => {
    if (params.sort === "outstanding") {
      return Number(b.amount_outstanding) - Number(a.amount_outstanding);
    }
    if (params.sort === "budget") return b.budget_total - a.budget_total;
    return b.created_at.localeCompare(a.created_at);
  });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Track build status, budget, spend, payments, and post-handover farm visibility."
      />

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <form className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
            <label className="grid gap-1.5 text-sm font-medium">
              Status
              <Select name="status" defaultValue={params.status ?? ""} className="min-w-48">
                <option value="">All statuses</option>
                <option value="registered">Registered</option>
                <option value="in_progress">In progress</option>
                <option value="stocked">Stocked</option>
                <option value="complete">Complete</option>
              </Select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Sort by
              <Select name="sort" defaultValue={params.sort ?? "recent"} className="min-w-48">
                <option value="recent">Most recent</option>
                <option value="outstanding">Outstanding balance</option>
                <option value="budget">Largest budget</option>
              </Select>
            </label>
            <Button type="submit" variant="outline">
              <FunnelSimple size={18} /> Apply
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Flock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link href={`/admin/projects/${project.id}`} className="font-semibold hover:text-primary">
                      {project.customer_name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">{project.customer_contact}</p>
                  </TableCell>
                  <TableCell>{project.regions?.name}</TableCell>
                  <TableCell className="font-mono">{project.flock_size.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={project.status} /></TableCell>
                  <TableCell className="font-mono text-xs">{formatCurrency(project.budget_total)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatCurrency(project.amount_spent)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatCurrency(project.amount_received)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-red-700">
                    {formatCurrency(project.amount_outstanding)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
