"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ImageUp, Trash2 } from "lucide-react";

import { Field, inputClass } from "@/components/docs/builder/shared";
import type { ImageInspectorProps } from "@/components/docs/builder/inspector/types";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function numericValue(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export default function ImageInspector({ component, onChange, activeTab }: ImageInspectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  if (activeTab === "data") {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="عرض (px)">
            <input
              dir="ltr"
              type="number"
              min={1}
              className={inputClass}
              value={component.width ?? ""}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  width: numericValue(event.target.value, 1),
                }))
              }
            />
          </Field>
          <Field label="ارتفاع (px)">
            <input
              dir="ltr"
              type="number"
              min={1}
              className={inputClass}
              value={component.height ?? ""}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  height: numericValue(event.target.value, 1),
                }))
              }
            />
          </Field>
        </div>
        <Field label="ضخامت حاشیه (px)">
          <input
            dir="ltr"
            type="number"
            min={0}
            max={20}
            className={inputClass}
            value={component.style?.borderWidth ?? 1}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                style: {
                  ...current.style,
                  borderWidth: Math.min(numericValue(event.target.value, 0), 20),
                },
              }))
            }
          />
        </Field>
        <Field label="رنگ حاشیه">
          <div className="flex gap-3">
            <input
              type="color"
              className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
              value={component.style?.borderColor ?? "#e2e8f0"}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  style: { ...current.style, borderColor: event.target.value },
                }))
              }
            />
            <input
              dir="ltr"
              className={inputClass}
              value={component.style?.borderColor ?? "#e2e8f0"}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  style: { ...current.style, borderColor: event.target.value },
                }))
              }
            />
          </div>
        </Field>
        <Field label="گردی گوشه‌ها (px)">
          <input
            dir="ltr"
            type="number"
            min={0}
            max={100}
            className={inputClass}
            value={component.style?.borderRadius ?? 12}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                style: {
                  ...current.style,
                  borderRadius: Math.min(numericValue(event.target.value, 0), 100),
                },
              }))
            }
          />
        </Field>
      </div>
    );
  }

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("فایل انتخاب‌شده باید تصویر باشد.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const src = reader.result;
      const preview = new window.Image();
      preview.onload = () => {
        onChange((current) => ({
          ...current,
          src,
          alt: current.alt || file.name.replace(/\.[^.]+$/, ""),
          width: preview.naturalWidth,
          height: preview.naturalHeight,
        }));
        setError(null);
      };
      preview.onerror = () => setError("خواندن تصویر انجام نشد.");
      preview.src = src;
    };
    reader.onerror = () => setError("خواندن فایل انجام نشد.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={selectImage} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sky-300 bg-sky-50 px-4 py-5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
      >
        <ImageUp size={19} aria-hidden="true" />
        {component.src ? "تعویض تصویر" : "انتخاب و آپلود تصویر"}
      </button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {component.src ? (
        <button
          type="button"
          onClick={() => onChange((current) => ({ ...current, src: "", width: undefined, height: undefined }))}
          className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          <Trash2 size={16} aria-hidden="true" /> حذف تصویر
        </button>
      ) : null}
      <Field label="متن جایگزین (Alt)">
        <input
          className={inputClass}
          value={component.alt}
          onChange={(event) => onChange((current) => ({ ...current, alt: event.target.value }))}
          placeholder="توضیح کوتاه و دقیق تصویر"
        />
      </Field>
      <Field label="توضیح زیر تصویر">
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={component.caption ?? ""}
          onChange={(event) => onChange((current) => ({ ...current, caption: event.target.value }))}
          placeholder="اختیاری"
        />
      </Field>
    </div>
  );
}
