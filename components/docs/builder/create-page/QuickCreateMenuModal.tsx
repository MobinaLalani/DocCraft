"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Field, inputClass } from "@/components/docs/builder/shared";

type QuickCreateMenuModalProps = {
  title: string;
  description: string;
  isActive: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onActiveChange: (value: boolean) => void;
  onCreate: () => void | Promise<void>;
  onClose: () => void;
};

export function QuickCreateMenuModal({
  title,
  description,
  isActive,
  onTitleChange,
  onDescriptionChange,
  onActiveChange,
  onCreate,
  onClose,
}: QuickCreateMenuModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isTitleEmpty = title.trim().length === 0;

  const handleCreate = async () => {
    if (isTitleEmpty) {
      setErrorMessage("عنوان منو را وارد کن.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await onCreate();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "ایجاد منو انجام نشد.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-create-menu-title"
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sky-700">افزودن سریع</p>
            <h3 id="quick-create-menu-title" className="mt-1 text-xl font-semibold text-slate-950">
              ایجاد منوی جدید
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="بستن پنجره"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="عنوان منو">
            <input
              autoFocus
              className={`${inputClass} !rounded-xl ${errorMessage && isTitleEmpty ? "border-rose-300" : ""}`}
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="مثلا احراز هویت"
            />
          </Field>
          <Field label="توضیح منو">
            <textarea
              className={`${inputClass} min-h-24 resize-y !rounded-xl`}
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="توضیح کوتاه درباره این گروه منو"
            />
          </Field>
          <Field label="وضعیت نمایش">
            <select
              className={`${inputClass} !rounded-xl`}
              value={isActive ? "active" : "inactive"}
              onChange={(event) => onActiveChange(event.target.value === "active")}
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </Field>
          {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isSaving || isTitleEmpty}
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSaving ? "در حال ایجاد..." : "ایجاد منو"}
          </button>
        </div>
      </div>
    </div>
  );
}
