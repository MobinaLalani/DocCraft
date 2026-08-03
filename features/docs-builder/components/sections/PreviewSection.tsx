"use client";

import { useState } from "react";

import { BlockPicker } from "@/components/docs/builder/block-picker";

import { DocsSitePreview } from "@/features/docs-preview";

import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";
import type { PageComponentType } from "@/lib/docs/schema";

type PreviewSectionProps = {
  menuGroups: MenuGroup[];

  pages: DocPage[];

  activePageSlug: string;

  onSelectPage: (slug: string) => void;

  onCreatePage: () => void;

  onEditPage: () => void;

  onAddBlock: (type: PageComponentType) => void;
};

export function PreviewSection({
  menuGroups,
  pages,
  activePageSlug,

  onSelectPage,
  onCreatePage,
  onEditPage,
  onAddBlock,
}: PreviewSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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

          <button
            type="button"
            onClick={() => setIsPickerOpen((value) => !value)}
            className="
rounded-2xl
border
px-4
py-2
text-sm
"
          >
            افزودن بلاک
          </button>
        </div>

        {isPickerOpen && (
          <div
            className="
mt-4
border-t
pt-4
"
          >
            <BlockPicker
              onAddBlock={(type) => {
                onAddBlock(type);

                setIsPickerOpen(false);
              }}
            />
          </div>
        )}
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
