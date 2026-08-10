"use client";

import { useState, type DragEvent } from "react";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
  const [draggingComponentId, setDraggingComponentId] = useState<string | null>(null);
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);
  const [lastReorderIndex, setLastReorderIndex] = useState<number | null>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    onDropAt(event, index);
    setDraggingComponentId(null);
    setActiveDropIndex(null);
    setLastReorderIndex(null);
  };

  const handleDragOverZone = (
    event: DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = draggingComponentId ? "move" : "copy";
    setActiveDropIndex(index);

    if (draggingComponentId && lastReorderIndex !== index) {
      onDropAt(event, index);
      setLastReorderIndex(index);
    }
  };

  const renderDropZone = (index: number) => (
    <div
      key={`drop-zone-${index}`}
      className="flex h-5 items-center py-2"
      onDragEnter={(event) => {
        handleDragOverZone(event, index);
      }}
      onDragOver={(event) => handleDragOverZone(event, index)}
      onDrop={(event) => handleDrop(event, index)}
    >
      <div
        className={`h-1 w-full rounded-full transition ${
          activeDropIndex === index
            ? "bg-sky-500 shadow-[0_0_0_3px_rgba(14,165,233,0.15)]"
            : draggingComponentId
              ? "bg-sky-100"
              : "bg-transparent"
        }`}
      />
    </div>
  );

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
        {activePage.components.length === 0 ? (
          <div
            className={`flex min-h-40 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm transition ${
              activeDropIndex === 0
                ? "border-sky-400 bg-sky-50 text-sky-700"
                : "border-slate-300 bg-slate-50 text-slate-500"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setActiveDropIndex(0);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, 0)}
          >
            اولین کامپوننت را اینجا رها کن.
          </div>
        ) : null}
        {activePage.components.length > 0 ? renderDropZone(0) : null}
        {activePage.components.map((component, index) => (
          <motion.div
            key={component.id}
            layout="position"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(componentTransferKey, component.id);
                setDraggingComponentId(component.id);
                setLastReorderIndex(index);
              }}
              onDragEnd={() => {
                setDraggingComponentId(null);
                setActiveDropIndex(null);
                setLastReorderIndex(null);
              }}
              onClick={() => onSelectComponent(component.id)}
              className={`
group cursor-grab rounded-xl border p-5 transition active:cursor-grabbing
${
  selectedComponentId === component.id
    ? "bg-slate-950 text-white"
    : "bg-slate-50"
}
${draggingComponentId === component.id ? "opacity-40" : "opacity-100"}
`}
            >
              <div className="flex justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <GripVertical className="mt-1 size-5 shrink-0 text-slate-400" aria-hidden="true" />
                  <div className="min-w-0">
                  <span>{component.type}</span>

                  <p className="font-bold">{getBlockLabel(component)}</p>

                  <p className="text-sm">{getBlockMeta(component)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDuplicateComponent(component);
                    }}
                    className="rounded-xl p-2 transition hover:bg-white/15"
                    aria-label="کپی کامپوننت"
                  >
                    <Copy className="size-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveComponent(component.id);
                    }}
                    className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-50/15"
                    aria-label="حذف کامپوننت"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            {renderDropZone(index + 1)}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
