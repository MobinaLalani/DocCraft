"use client";

import { useState } from "react";
import { Braces, Check, FileInput, FileOutput, WandSparkles } from "lucide-react";
import { methodOptions } from "@/lib/docs/builder";
import { Field, inputClass } from "@/components/docs/builder/shared";
import type { EndpointInspectorProps } from "@/components/docs/builder/inspector/types";

function jsonError(value: string | undefined) {
  if (!value?.trim()) return null;
  try {
    JSON.parse(value);
    return null;
  } catch {
    return "ساختار JSON معتبر نیست";
  }
}

function JsonEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const error = jsonError(value);
  function formatJson() {
    if (!value?.trim() || error) return;
    onChange(JSON.stringify(JSON.parse(value), null, 2));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Braces size={16} className="text-violet-500" />
          {label}
        </div>
        <button
          type="button"
          disabled={!value?.trim() || Boolean(error)}
          onClick={formatJson}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <WandSparkles size={13} />
          مرتب‌سازی
        </button>
      </div>
      <textarea
        dir="ltr"
        spellCheck={false}
        className="min-h-64 w-full resize-y bg-[#202b33] px-4 py-3 font-mono text-xs leading-6 text-slate-100 outline-none"
        value={value ?? ""}
        placeholder={'{\n  "key": "value"\n}'}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className={`flex items-center gap-1.5 border-t px-4 py-2 text-xs ${error ? "border-rose-100 bg-rose-50 text-rose-600" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>
        {!error && <Check size={13} />}
        {error ?? (value?.trim() ? "JSON معتبر است و در پیش‌نمایش نمایش داده می‌شود" : "برای این بخش نمونه‌ای وارد نشده است")}
      </div>
    </div>
  );
}

export default function EndpointInspector({ component, onChange, activeTab }: EndpointInspectorProps) {
  const [exampleTab, setExampleTab] = useState<"request" | "response">("request");

  if (activeTab === "data") {
    return (
      <div className="space-y-5">
        <Field label="خلاصه">
          <textarea className={`${inputClass} min-h-24`} value={component.summary} onChange={(event) => onChange((current) => ({ ...current, summary: event.target.value }))} />
        </Field>
        <Field label="احراز هویت">
          <input className={inputClass} value={component.auth ?? ""} onChange={(event) => onChange((current) => ({ ...current, auth: event.target.value }))} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Request Content-Type">
            <input dir="ltr" className={inputClass} value={component.requestContentType ?? ""} onChange={(event) => onChange((current) => ({ ...current, requestContentType: event.target.value }))} />
          </Field>
          <Field label="Response Content-Type">
            <input dir="ltr" className={inputClass} value={component.responseContentType ?? ""} onChange={(event) => onChange((current) => ({ ...current, responseContentType: event.target.value }))} />
          </Field>
        </div>
        <div className="rounded-2xl bg-slate-100 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button type="button" onClick={() => setExampleTab("request")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${exampleTab === "request" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              <FileInput size={16} /> ورودی JSON
            </button>
            <button type="button" onClick={() => setExampleTab("response")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${exampleTab === "response" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              <FileOutput size={16} /> خروجی JSON
            </button>
          </div>
        </div>
        {exampleTab === "request" ? (
          <JsonEditor label="Request body" value={component.requestExample} onChange={(value) => onChange((current) => ({ ...current, requestExample: value }))} />
        ) : (
          <div className="space-y-4">
            <Field label="Status code">
              <input dir="ltr" type="number" className={inputClass} value={component.responseStatus ?? 200} onChange={(event) => onChange((current) => ({ ...current, responseStatus: Number(event.target.value) || 200 }))} />
            </Field>
            <JsonEditor label="Response body" value={component.responseExample} onChange={(value) => onChange((current) => ({ ...current, responseExample: value }))} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Field label="عنوان">
        <input className={inputClass} value={component.title} onChange={(event) => onChange((current) => ({ ...current, title: event.target.value }))} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
        <Field label="Method">
          <select className={inputClass} value={component.method} onChange={(event) => onChange((current) => ({ ...current, method: event.target.value as typeof current.method }))}>
            {methodOptions.map((method) => <option key={method} value={method}>{method}</option>)}
          </select>
        </Field>
        <Field label="Path">
          <input dir="ltr" className={inputClass} value={component.path} onChange={(event) => onChange((current) => ({ ...current, path: event.target.value }))} />
        </Field>
      </div>
    </div>
  );
}
