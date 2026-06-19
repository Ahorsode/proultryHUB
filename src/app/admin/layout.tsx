// TODO: Add Supabase Auth check here once owner auth is ready.
// No auth enforced in Phase 1 — this dashboard is intentionally open.

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="px-4 py-6 sm:px-6 lg:ml-60 lg:px-7 xl:px-9">{children}</main>
    </div>
  );
}
