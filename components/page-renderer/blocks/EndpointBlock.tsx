import type { EndpointComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/components/page-renderer/types";

const methodConfig: Record<EndpointComponent["method"], { badge: string; shell: string; border: string }> = {
  GET: { badge: "bg-[#61affe]", shell: "bg-[#ebf3fb]", border: "border-[#61affe]" },
  POST: { badge: "bg-[#49cc90]", shell: "bg-[#e8f6f0]", border: "border-[#49cc90]" },
  PUT: { badge: "bg-[#fca130]", shell: "bg-[#fbf1e6]", border: "border-[#fca130]" },
  PATCH: { badge: "bg-[#50e3c2]", shell: "bg-[#e9faf6]", border: "border-[#50e3c2]" },
  DELETE: { badge: "bg-[#f93e3e]", shell: "bg-[#fbe9e9]", border: "border-[#f93e3e]" },
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function parseJson(value?: string): JsonValue | undefined {
  if (!value?.trim()) return undefined;
  try {
    return JSON.parse(value) as JsonValue;
  } catch {
    return undefined;
  }
}

function valueType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return value.length ? `array<${valueType(value[0])}>` : "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}

function schemaRows(value: JsonValue, prefix = ""): { name: string; type: string }[] {
  if (Array.isArray(value)) return value.length ? schemaRows(value[0], prefix ? `${prefix}[]` : "items[]") : [];
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      const name = prefix ? `${prefix}.${key}` : key;
      const row = { name, type: valueType(child) };
      return child !== null && typeof child === "object" ? [row, ...schemaRows(child, name)] : [row];
    });
  }
  return prefix ? [{ name: prefix, type: valueType(value) }] : [];
}

function ExamplePanel({ title, contentType, raw }: { title: string; contentType: string; raw?: string }) {
  const parsed = parseJson(raw);
  const rows = parsed === undefined ? [] : schemaRows(parsed);
  return (
    <section className="border-t border-slate-200 px-5 py-5 sm:px-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <span className="rounded border border-slate-300 bg-white px-2 py-1 font-mono text-[11px] text-slate-600">{contentType}</span>
      </div>
      {!raw?.trim() ? (
        <div className="rounded border border-dashed border-slate-300 bg-white/60 px-4 py-5 text-center text-xs text-slate-500">نمونه JSON برای این بخش تعریف نشده است.</div>
      ) : parsed === undefined ? (
        <div className="rounded border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">JSON واردشده معتبر نیست.</div>
      ) : (
        <div className="grid overflow-hidden rounded-md border border-slate-300 bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,.8fr)]">
          <div className="min-w-0 bg-[#263238] p-4" dir="ltr">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Example Value</div>
            <pre className="overflow-x-auto whitespace-pre font-mono text-xs leading-6 text-[#e6e6e6]">{JSON.stringify(parsed, null, 2)}</pre>
          </div>
          <div className="border-t border-slate-200 lg:border-l lg:border-t-0" dir="ltr">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Schema / types</div>
            <div className="max-h-72 divide-y divide-slate-100 overflow-auto">
              {rows.map((row, index) => (
                <div key={`${row.name}-${index}`} className="flex items-start justify-between gap-3 px-4 py-2.5">
                  <code className="break-all text-xs font-semibold text-slate-700">{row.name}</code>
                  <span className="shrink-0 font-mono text-[11px] italic text-violet-600">{row.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function EndpointBlock({ component }: PageBlockProps<EndpointComponent>) {
  const config = methodConfig[component.method];
  const endpointStyle = component.style;
  return (
    <article dir="ltr" className={`overflow-hidden rounded-md border ${config.border} bg-white text-left shadow-sm`}>
      <header className={`${config.shell} px-4 py-4 sm:px-5`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`${config.badge} min-w-20 rounded px-3 py-2 text-center text-xs font-bold text-white shadow-sm`}>{component.method}</span>
          <code className="min-w-0 flex-1 break-all font-mono text-sm font-semibold text-slate-800" style={{ color: endpointStyle?.pathTextColor }}>{component.path}</code>
          <span className="text-sm text-slate-600">{component.title}</span>
        </div>
        {component.summary && <p className="mt-4 text-sm leading-6 text-slate-600" style={{ color: endpointStyle?.summaryColor }}>{component.summary}</p>}
      </header>

      <div className="grid border-t border-slate-200 bg-white sm:grid-cols-3">
        <MetaCell label="Authorization" value={component.auth ?? "None"} />
        <MetaCell label="Request" value={component.requestContentType ?? "application/json"} />
        <MetaCell label="Response" value={component.responseContentType ?? "application/json"} />
      </div>

      <ExamplePanel
        title="Request body"
        contentType={component.requestContentType ?? "application/json"}
        raw={component.requestExample ?? "{}"}
      />
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-7">
        <h4 className="text-sm font-bold text-slate-800">Responses</h4>
      </div>
      <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3 sm:px-7">
        <span className="font-mono text-sm font-bold text-emerald-600">{component.responseStatus ?? 200}</span>
        <span className="text-xs text-slate-500">Successful response</span>
      </div>
      <ExamplePanel
        title="Response body"
        contentType={component.responseContentType ?? "application/json"}
        raw={component.responseExample ?? "{}"}
      />
    </article>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-slate-100 px-5 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-mono text-xs text-slate-700">{value}</p></div>;
}
