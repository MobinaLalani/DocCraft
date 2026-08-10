"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PanelLeftClose, X } from "lucide-react";

import { InspectorPanel } from "@/components/docs/builder/inspector-panel";
import type { PageComponent } from "@/lib/docs/schema";

type ComponentInspectorDrawerProps = {
  isOpen: boolean;
  selectedComponent: PageComponent | null;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave?: () => void;
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
};

const drawerTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.9,
};

export function ComponentInspectorDrawer({
  isOpen,
  selectedComponent,
  hasUnsavedChanges = true,
  isSaving = false,
  onClose,
  onSave,
  onUpdateSelectedComponent,
}: ComponentInspectorDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && selectedComponent ? (
        <div className="fixed inset-0 z-[100]" dir="rtl">
          <motion.button
            type="button"
            aria-label="بستن پنل ویرایش"
            className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="ویرایش کامپوننت انتخاب‌شده"
            className="absolute inset-y-0 left-0 flex w-full max-w-[460px] flex-col bg-white shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={drawerTransition}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <PanelLeftClose className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-sky-700">ویرایش زنده</p>
                  <h2 className="truncate font-semibold text-slate-950">
                    تنظیمات کامپوننت
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
              <InspectorPanel
                selectedComponent={selectedComponent}
                onUpdateSelectedComponent={onUpdateSelectedComponent}
              />
            </div>

            <footer className="shrink-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur">
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                <span
                  className={`h-2 w-2 rounded-full ${
                    onSave && !hasUnsavedChanges
                      ? "bg-emerald-500"
                      : "bg-amber-400"
                  }`}
                />
                {onSave && hasUnsavedChanges
                  ? "تغییرات هنوز ذخیره نشده‌اند"
                  : onSave
                    ? "همه تغییرات ذخیره شده‌اند"
                    : "تغییرات در پیش‌نویس صفحه اعمال می‌شوند"}
              </div>
              <div className="flex gap-3">
                {onSave ? (
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={!hasUnsavedChanges || isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    <Check className="h-4 w-4" />
                    {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className={`rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${
                    onSave ? "" : "w-full"
                  }`}
                >
                  بستن
                </button>
              </div>
            </footer>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
