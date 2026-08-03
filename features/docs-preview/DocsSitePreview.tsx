"use client";

import { useSidebar } from "@/context/SidebarContext";
import {
  DocsSitePreviewFooter,
  DocsSitePreviewNavbar,
  DocsSitePreviewSidebar,
} from "@/components/layout/docsSitePreviewLayout";
import { getDocsRoadmap } from "./model/getDocsRoadmap";
import { getFooterSections } from "./model/getFooterSections";
import { getPageNavigation } from "./model/getPageNavigation";
import { DocsRoadmap } from "./components/ui/DocsRoadmap";
import { PageNavigation } from "./components/ui/PageNavigation";
import { PageRenderer } from "@/features/docs-builder/components/renderer/PageRenderer";
import type { AuthSession } from "@/lib/auth/types";
import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";

type DocsSitePreviewProps = {
  menuGroups: MenuGroup[];
  pages: DocPage[];
  activePageSlug?: string;
  activeGroupId?: string;
  session?: AuthSession;
  interactive?: boolean;
  onSelectPage?: (slug: string) => void;
  onCreatePage?: () => void;
  showSidebar?: boolean;
  content?: React.ReactNode;
  contained?: boolean;
};
export function DocsSitePreview(props: DocsSitePreviewProps) {
  const {
    menuGroups,
    pages,
    activePageSlug,
    activeGroupId,
    session,
    interactive,
    onSelectPage,
    onCreatePage,
    showSidebar = true,
    content,
    contained = true,
  } = props;
  const { isOpen: isSidebarOpen } = useSidebar();

  const activePage = activePageSlug
    ? (pages.find((p) => p.slug === activePageSlug) ?? pages[0])
    : undefined;
  const navigation = getPageNavigation(pages, activePage?.slug);
  const resolvedActiveGroupId = activeGroupId ?? activePage?.menuGroupId;
  const footerSections = getFooterSections(
    menuGroups,
    pages,
    resolvedActiveGroupId,
  );
  const activeGroup = menuGroups.find(
    (group) => group.id === resolvedActiveGroupId,
  );
  const roadmapItems = getDocsRoadmap({
    activePage: activePageSlug ? activePage : undefined,
    activeGroup,
  });
  const sidebarPaddingClass = showSidebar
    ? isSidebarOpen
      ? "xl:pr-[320px]"
      : "xl:pr-18"
    : "";
  const navTitle = activePage?.title ?? activeGroup?.title ?? "مستندات API";
  const navSubtitle =
    activePage?.menuTitle ??
    activeGroup?.description?.trim() ??
    "مرور مستندات سرویس‌ها و وب‌سرویس‌ها";

  return (
    <div dir="ltr" className={`relative mx-10 ${contained ? "h-screen" : ""}`}>
      <div
        className={`${contained ? "absolute inset-x-0 top-0" : "relative"} z-30 transition-[padding] duration-300 ${
          isSidebarOpen ? "xl:pr-[50px]" : "xl:pr-5"
        }`}
      >
        <div
          className={`${contained ? "absolute inset-x-0 top-0" : "sticky top-0"} z-30 transition-[padding] duration-300 ${sidebarPaddingClass}`}
        >
          <DocsSitePreviewNavbar
            session={session}
            title={navTitle}
            subtitle={navSubtitle}
          />
        </div>
        <main
          dir="rtl"
          className={`${contained ? "h-screen overflow-y-auto pt-28 sm:pt-32" : ""} min-w-0 p-4 transition-[padding] duration-300 sm:p-6 ${sidebarPaddingClass}`}
        >
          <div className="flex min-h-full flex-col gap-6">
            <div className="flex-1">
              <DocsRoadmap items={roadmapItems} />

              {content ? (
                <div className="mt-6">{content}</div>
              ) : activePage ? (
                <div className="mt-6 flex min-h-[80vh] flex-col gap-4">
                  <PageRenderer
                    page={activePage}
                    className="flex-1 min-h-[calc(80vh-12rem)]"
                  />
                  <PageNavigation
                    previousPage={navigation.previousPage}
                    nextPage={navigation.nextPage}
                    interactive={interactive}
                    onSelectPage={onSelectPage}
                  />
                </div>
              ) : null}
            </div>

            <DocsSitePreviewFooter
              serviceLinks={footerSections.serviceLinks}
              webServiceLinks={footerSections.webServiceLinks}
            />
          </div>
        </main>

        {showSidebar && (
          <DocsSitePreviewSidebar
            menuGroups={menuGroups}
            pages={pages}
            activePageSlug={activePageSlug}
            activeGroupId={activeGroupId}
            interactive={interactive}
            onSelectPage={onSelectPage}
            onCreatePage={onCreatePage}
          />
        )}
      </div>
    </div>
  );
}
