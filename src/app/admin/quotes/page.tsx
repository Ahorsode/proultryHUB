import Link from "next/link";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { NewQuoteForm } from "@/components/admin/new-quote-form";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getQuotes, getRegions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const [{ new: showNew }, quotes, regions] = await Promise.all([
    searchParams,
    getQuotes(),
    getRegions(),
  ]);

  return (
    <>
      <PageHeader
        title="Quotes"
        description="Turn flock size and region into a detailed, editable construction quote."
        action={
          <Button asChild>
            <Link href={showNew ? "/admin/quotes" : "/admin/quotes?new=1"}>
              {showNew ? <X size={18} /> : <Plus size={18} weight="bold" />}
              {showNew ? "Close form" : "New Quote"}
            </Link>
          </Button>
        }
      />

      {showNew ? (
        <Card className="mb-4">
          <CardHeader className="border-b">
            <CardTitle>Create a quote</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <NewQuoteForm regions={regions} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Flock size</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total cost</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>
                    <Link href={`/admin/quotes/${quote.id}`} className="font-semibold hover:text-primary">
                      {quote.customer_name || "Unnamed prospect"}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">{quote.customer_contact || "No contact yet"}</p>
                  </TableCell>
                  <TableCell className="font-mono">{quote.flock_size.toLocaleString()}</TableCell>
                  <TableCell>{quote.regions?.name}</TableCell>
                  <TableCell><StatusBadge status={quote.status} /></TableCell>
                  <TableCell className="font-mono">{formatCurrency(quote.cost_total)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(quote.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!quotes.length ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No quotes yet. Create the first one.</div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
