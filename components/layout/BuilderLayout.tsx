"use client";

import {
  AdminDocsNavbar,
  AdminDocsSidebar,
} from "@/components/layout/docsSiteBuilderLayout";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";
import { useSidebar } from "@/context/SidebarContext";

import type { AuthSession } from "@/lib/auth/types";

type BuilderLayoutProps = {
  children: React.ReactNode;
  session: AuthSession;
};

export default function BuilderLayout({
  children,
  session,
}: BuilderLayoutProps) {
  const { state, actions } = useDocsBuilderContext();
  
  const { isOpen } = useSidebar();

  return (
    <section dir="ltr" className="min-h-screen">
      <div
        className={`
          flex
          flex-col
          transition-[padding]
          duration-300

          ${isOpen ? "xl:pr-90" : "xl:pr-18"}

        `}
      >
        <AdminDocsNavbar session={session} />

        <main
          dir="rtl"
          className="
            p-6
            transition-all
            duration-300
          "
        >
          {children}
        </main>
      </div>

      <AdminDocsSidebar
        activeView={state.activeView}
        workspace={state.workspace}
        selectedPageSlug={state.selectedPageSlug}
        onOpenView={actions.setActiveView}
        onSelectPage={actions.selectPage}
      />
    </section>
  );
}
