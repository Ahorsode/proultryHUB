import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold">This record could not be found.</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed or the link may be incomplete.</p>
        <Button asChild className="mt-6"><Link href="/admin">Return to dashboard</Link></Button>
      </div>
    </main>
  );
}
