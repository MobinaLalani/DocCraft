"use client";

import Link from "next/link";

import Footer from "@/components/layout/Footer";
import { useSidebar } from "@/context/SidebarContext";
import { ComponentsSettingNavbar, ComponentsSettingSidebar } from "@/features/componentsSetting/layout";
import { AdminDocsSidebar } from "./docsSiteBuilderLayout";
import type { AuthSession } from "@/lib/auth/types";
import type { DocsWorkspace } from "@/lib/docs/workspace";

type AdminShellProps = {
  session: AuthSession;
  workspace: DocsWorkspace;
  children: React.ReactNode;
};

export default function AdminShell({ session, workspace, children }: AdminShellProps) {
  const { isOpen } = useSidebar();

  return (
    <section dir="ltr" className="flex min-h-screen">
      {/* Main Area */}
      <div
        className={`flex flex-1 flex-col transition-[padding] duration-300 ${
          isOpen ? "xl:pr-[360px]" : "xl:pr-[72px]"
        }`}
      >
        {/* Navbar */}
        <ComponentsSettingNavbar session={session} title="پنل مدیریت ادمین" />

        {/* Page Content */}
        <main dir="rtl" className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer className="m-3 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div
            className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 text-right"
            dir="rtl"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-600">
                Admin Panel
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                پنل مدیریت داکیومنت
              </p>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <span>
                <span className="font-semibold text-slate-900">
                  {workspace.pages.length}
                </span>{" "}
                صفحه
              </span>
              <span>
                <span className="font-semibold text-slate-900">
                  {workspace.menuGroups.length}
                </span>{" "}
                منو
              </span>
            </div>
            <Link
              href="/admin"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              بازگشت به پنل ساخت
            </Link>
          </div>
        </Footer>
      </div>

      {/* Sidebar */}
      {/* <ComponentsSettingSidebar /> */}

      {/* <AdminDocsSidebar
        activeView={activeView}
        workspace={workspace}
        selectedPageSlug={selectedPageSlug}
        onOpenView={onOpenView}
        onSelectPage={onSelectPage}
      /> */}
    </section>
  );
}
