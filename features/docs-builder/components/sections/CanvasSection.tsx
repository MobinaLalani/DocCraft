"use client";

import { useState, type DragEvent } from "react";

import { PageRenderer } from "@/features/docs-builder/components/renderer/PageRenderer";

import {
  componentTransferKey,
  getBlockLabel,
  getBlockMeta,
} from "@/components/docs/builder/constants";

import type { DocPage, PageComponent } from "@/lib/docs/schema";

type CanvasSectionProps = {
  activePage: DocPage;

  selectedComponentId: string | null;

  onSelectComponent: (id: string) => void;

  onDropAt: (event: DragEvent<HTMLDivElement>, index: number) => void;

  onDuplicateComponent: (component: PageComponent) => void;

  onRemoveComponent: (id: string) => void;
};

export function CanvasSection({
  activePage,
  selectedComponentId,
  onSelectComponent,
  onDropAt,
  onDuplicateComponent,
  onRemoveComponent,
}: CanvasSectionProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex justify-between mb-5">
        <div>
          <p className="text-sm text-slate-500">بوم صفحه</p>

          <h3 className="text-2xl font-semibold">کامپوننت ها</h3>
        </div>

        <button
          onClick={() => setIsPreviewVisible((v) => !v)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          {isPreviewVisible ? "بستن پیش نمایش" : "نمایش پیش نمایش"}
        </button>
      </div>

      {isPreviewVisible && (
        <div className="mb-5 rounded-xl bg-slate-50 p-4">
          <PageRenderer page={activePage} />
        </div>
      )}

      <div className="space-y-3">
        {activePage.components.map((component, index) => (
          <div key={component.id}>
            <div
              className="h-3 border-dashed border"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropAt(e, index)}
            />

            <div
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(componentTransferKey, component.id)
              }
              onClick={() => onSelectComponent(component.id)}
              className={`
rounded-3xl border p-5
${
  selectedComponentId === component.id
    ? "bg-slate-950 text-white"
    : "bg-slate-50"
}
`}
            >
              <div className="flex justify-between">
                <div>
                  <span>{component.type}</span>

                  <p className="font-bold">{getBlockLabel(component)}</p>

                  <p className="text-sm">{getBlockMeta(component)}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => onDuplicateComponent(component)}>
                    کپی
                  </button>

                  <button onClick={() => onRemoveComponent(component.id)}>
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
