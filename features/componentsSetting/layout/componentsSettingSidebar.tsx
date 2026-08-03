"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Puzzle, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const adminNavItems: NavItem[] = [
  {
    label: "پنل اصلی",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "تنظیمات کامپوننت‌ها",
    href: "/admin/componentsSetting",
    icon: Puzzle,
  },
  {
    label: "ایمپورت از Swagger",
    href: "/swagger-import",
    icon: Zap,
  },
];

export function ComponentsSettingSidebar() {
  const { isOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar
      className="border-l border-white/10 bg-(--darkBlue) text-white overflow-hidden"
      expandedWidthClassName="w-full sm:w-[360px]"
    >
      {/* Header */}
      <div
        className={`border-b border-white/10 pb-5 overflow-hidden ${
          isOpen ? "px-5" : "px-3"
        }`}
      >
        {isOpen ? (
          <div className="overflow-hidden">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 truncate">
              Admin Panel
            </p>
            <h2 className="mt-2 text-2xl font-semibold truncate">
              پنل مدیریت
            </h2>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold text-slate-300">
              A
            </span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden ${
          isOpen ? "space-y-1 px-3 py-4" : "space-y-2 px-2 py-4"
        }`}
      >
        {/* {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (!isOpen) {
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex h-11 w-11 mx-auto items-center justify-center rounded-2xl transition ${
                  isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? "text-slate-950" : "text-slate-300"}`}
                strokeWidth={2}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="mr-auto h-1.5 w-1.5 rounded-full bg-(--lightBlue)" />
              )}
            </Link>
          );
        })} */}
      </nav>
    </Sidebar>
  );
}
