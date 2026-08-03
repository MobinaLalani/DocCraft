"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarPageItem } from "@/components/layout/sidebar/SidebarPageItem";
import { useSidebar } from "@/context/SidebarContext";
import type { AuthRole } from "@/lib/auth/types";
import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";

type DocsSitePreviewSidebarProps = {
  menuGroups: MenuGroup[];
  pages: DocPage[];
  activePageSlug?: string;
  activeGroupId?: string;
  interactive?: boolean;
  role?: AuthRole;
  onSelectPage?: (slug: string) => void;
  onCreatePage?: () => void;
};

export function DocsSitePreviewSidebar({
  menuGroups,
  pages,
  activePageSlug,
  interactive = false,
  role,
  onSelectPage,
  onCreatePage,
}: DocsSitePreviewSidebarProps) {
  const { isOpen } = useSidebar();
  const visibleMenuGroups = interactive
    ? menuGroups
    : menuGroups.filter((group) => group.isActive);

  const canCreatePage =
    interactive && onCreatePage && (role === "admin" || role === "editor");

  return (
    <Sidebar
      className="border-l border-white/10 bg-(--darkBlue) text-white overflow-hidden"
      expandedWidthClassName="w-full sm:w-[360px]"
    >
      {/* HEADER */}
      <div
        className={`border-b border-white/10 pb-5 overflow-hidden ${
          isOpen ? "px-5" : "px-3"
        }`}
      >
        {isOpen ? (
          <div className="overflow-hidden">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 truncate">
              مستندات API
            </p>
            <h2 className="mt-2 text-2xl font-semibold truncate">
              منوی داکیومنت
            </h2>
          </div>
        ) : (
          <div className="flex justify-center">
            {/* <span className="rounded-2xl bg-white/10 px-3 py-2 text-xs text-slate-300">
              M
            </span> */}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden ${
          isOpen ? "space-y-6 px-5 py-5" : "space-y-3 px-2 py-4"
        }`}
      >
        {/* CREATE PAGE — admin or editor only */}
        {canCreatePage && (
          <button
            type="button"
            onClick={onCreatePage}
            className={
              isOpen
                ? "w-full overflow-hidden rounded-2xl border border-dashed border-white/20 bg-emerald-500/10 px-4 py-3 text-right text-sm font-medium text-emerald-100 hover:bg-emerald-500/20"
                : "flex h-11 w-11 mx-auto items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
            }
          >
            {isOpen ? "ایجاد صفحه جدید" : "+"}
          </button>
        )}

        {/* GROUPS */}
        {visibleMenuGroups.map((group) => {
          const groupPages = pages.filter(
            (page) => page.menuGroupId === group.id,
          );

          return (
            <section key={group.id} className="overflow-hidden">
              {/* GROUP HEADER */}
              {isOpen ? (
                <div className="mb-1.5 flex items-center gap-2 overflow-hidden px-1">
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                    {group.title}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              ) : (
                <div className="mb-1 flex justify-center">
                
                </div>
              )}

              {/* PAGES — indented with tree line */}
              {isOpen ? (
                <div className="relative pr-2">
                  {/* Vertical tree line */}
                  <span className="absolute right-4.5 top-0 bottom-2 w-px bg-white/10" />
                  <div className="space-y-0.5">
                    {groupPages.map((page) => (
                      <SidebarPageItem
                        key={page.slug}
                        title={page.menuTitle}
                        initial={page.menuTitle.slice(0, 1)}
                        isActive={page.slug === activePageSlug}
                        isExpanded={isOpen}
                        href={interactive ? undefined : `/pages/${page.slug}`}
                        onClick={
                          interactive
                            ? () => onSelectPage?.(page.slug)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {groupPages.map((page) => (
                    <SidebarPageItem
                      key={page.slug}
                      title={page.menuTitle}
                      initial={page.menuTitle.slice(0, 1)}
                      isActive={page.slug === activePageSlug}
                      isExpanded={isOpen}
                      href={interactive ? undefined : `/pages/${page.slug}`}
                      onClick={
                        interactive
                          ? () => onSelectPage?.(page.slug)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </Sidebar>
  );
}

export default DocsSitePreviewSidebar;
