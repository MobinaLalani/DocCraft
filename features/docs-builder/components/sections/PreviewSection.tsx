"use client";

import { DocsSitePreview } from "@/features/docs-preview";

import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";

type PreviewSectionProps = {
  menuGroups: MenuGroup[];

  pages: DocPage[];

  activePageSlug: string;

  onSelectPage: (slug: string) => void;

  onCreatePage: () => void;

  onEditPage: () => void;

};

export function PreviewSection({
  menuGroups,
  pages,
  activePageSlug,

  onSelectPage,
  onCreatePage,
  onEditPage,
}: PreviewSectionProps) {
  return (
    <section className="space-y-4">
      <div
        className="
 rounded-3xl
 bg-white
 p-4
 "
      >
        <div
          className="
 flex
 justify-end
 gap-2
 "
        >
          <button
            type="button"
            onClick={onEditPage}
            className="
rounded-2xl
bg-slate-950
px-4
py-2
text-sm
font-bold
text-white
"
          >
            ویرایش صفحه
          </button>

        </div>
      </div>

      <DocsSitePreview
        menuGroups={menuGroups}
        pages={pages}
        activePageSlug={activePageSlug}
        interactive
        onSelectPage={onSelectPage}
        onCreatePage={onCreatePage}
        showSidebar={false}
        contained={false}
      />
    </section>
  );
}
