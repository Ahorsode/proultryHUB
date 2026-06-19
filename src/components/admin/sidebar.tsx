"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Buildings,
  CaretDown,
  ChartDonut,
  ClipboardText,
  Gear,
  House,
  Quotes,
  Warehouse,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Overview", icon: House, exact: true },
  { href: "/admin/quotes", label: "Quotes", icon: Quotes },
  { href: "/admin/projects", label: "Projects", icon: Buildings },
];

const futureNavigation = [
  { label: "Site inspections", icon: ClipboardText },
  { label: "Reports", icon: ChartDonut },
  { label: "Settings", icon: Gear },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-full flex-col bg-[#151a1c] text-white lg:fixed lg:inset-y-0 lg:w-60">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
        <div className="grid size-11 place-items-center rounded-md bg-[#d89a16] text-[#171b1d]">
          <Warehouse size={27} weight="bold" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">PoultryHub</p>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e8aa27]">Ghana</p>
        </div>
      </div>
      <p className="px-5 pt-4 text-xs text-[#a6aeae]">Farm Construction &amp; Management</p>

      <nav className="flex gap-2 overflow-x-auto px-3 py-5 lg:block lg:space-y-2 lg:overflow-visible">
        {navigation.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-max items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-[#d7dddd] transition-colors hover:bg-white/8 hover:text-white",
                active &&
                  "border-l-2 border-[#e6a51d] bg-[#7d5310] text-white shadow-[inset_16px_0_32px_rgba(205,137,20,0.18)]",
              )}
            >
              <item.icon size={21} weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-5 hidden border-t border-white/10 pt-5 lg:block">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#747d7d]">
          Coming later
        </p>
        <div className="space-y-1">
          {futureNavigation.map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-2 py-2.5 text-sm text-[#8f9898]">
              <item.icon size={20} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto hidden border-t border-white/10 p-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[#c98c14] font-bold">AA</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Akosua A.</p>
            <p className="text-xs text-[#9ea7a7]">Owner</p>
          </div>
          <CaretDown size={16} className="text-[#9ea7a7]" />
        </div>
      </div>
    </aside>
  );
}
