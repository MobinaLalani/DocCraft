"use client";

import { BlockPicker } from "@/components/docs/builder/block-picker";
import { InspectorPanel } from "@/components/docs/builder/inspector-panel";
import type { PageComponent, PageComponentType } from "@/lib/docs/schema";

type BuilderToolsColumnProps = {
  selectedComponent: PageComponent | null;
  onAddBlock: (type: PageComponentType) => void;
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
};

export function BuilderToolsColumn({
  selectedComponent,
  onAddBlock,
  onUpdateSelectedComponent,
}: BuilderToolsColumnProps) {
  return (
    <aside className="w-full space-y-6 xl:w-80 xl:shrink-0">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="text-xl font-semibold text-slate-950">کامپوننت‌ها</h4>
        <div className="mt-4">
          <BlockPicker onAddBlock={onAddBlock} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="text-xl font-semibold text-slate-950">
          ویرایش کامپوننت
        </h4>
        <InspectorPanel
          selectedComponent={selectedComponent}
          onUpdateSelectedComponent={onUpdateSelectedComponent}
        />
      </section>
    </aside>
  );
}
