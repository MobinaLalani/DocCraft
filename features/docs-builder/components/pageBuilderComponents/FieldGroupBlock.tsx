import type { FieldGroupComponent, ApiFieldKind } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";

const kindConfig: Record<ApiFieldKind, { label: string; badge: string }> = {
  headers: {
    label: "Headers",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  query: {
    label: "Query Params",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  path: {
    label: "Path Params",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
  },
  body: {
    label: "Request Body",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  response: {
    label: "Response",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

export function FieldGroupBlock({
  component,
}: PageBlockProps<FieldGroupComponent>) {
  const kind = kindConfig[component.kind];

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${kind.badge}`}
          >
            {kind.label}
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            {component.title}
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          {component.fields.length} فیلد
        </span>
      </div>

      {/* COLUMN HEADERS */}
      <div className="grid grid-cols-[1fr_auto_auto_2fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        {["نام", "نوع", "اجباری", "توضیحات"].map((h) => (
          <p
            key={h}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400"
          >
            {h}
          </p>
        ))}
      </div>

      {/* ROWS */}
      <div className="divide-y divide-slate-100">
        {component.fields.map((field) => (
          <div
            key={field.id}
            className="grid grid-cols-[1fr_auto_auto_2fr] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/60"
          >
            <p className="font-mono text-sm font-semibold text-slate-800">
              {field.name}
            </p>

            <span className="whitespace-nowrap rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-xs text-indigo-600">
              {field.type}
            </span>

            <div className="flex justify-center">
              {field.required ? (
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                  بله
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                  خیر
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
              {field.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
