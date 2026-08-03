"use client";

import { InspectorPanel } from "@/components/docs/builder/inspector-panel";

import type { PageComponent } from "@/lib/docs/schema";

type InspectorSectionProps = {
  selectedComponent: PageComponent | null;

  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
};

export function InspectorSection({
  selectedComponent,
  onUpdateSelectedComponent,
}: InspectorSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-slate-500">ویرایش کامپوننت</p>

        <h3 className="text-xl font-semibold">دیتای کامپوننت انتخاب شده</h3>
      </div>

      <InspectorPanel
        selectedComponent={selectedComponent}
        onUpdateSelectedComponent={onUpdateSelectedComponent}
      />
    </section>
  );
}
