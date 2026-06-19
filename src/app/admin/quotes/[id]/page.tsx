import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { QuoteEditor } from "@/components/admin/quote-editor";
import { getQuote, getRegions } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [quote, regions] = await Promise.all([getQuote(id), getRegions()]);
  if (!quote) notFound();

  return (
    <>
      <PageHeader
        title={quote.customer_name || "Unnamed prospect"}
        description={`Quote ${quote.id.slice(0, 8).toUpperCase()} · ${quote.flock_size.toLocaleString()} birds`}
        action={<div />}
      />
      <QuoteEditor quote={quote} regions={regions} />
    </>
  );
}
