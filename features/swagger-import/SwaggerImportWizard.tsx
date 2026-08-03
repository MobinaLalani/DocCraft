"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Code2,
  FileText,
  Globe,
  Layers,
  Loader2,
  Search,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";

import {
  fetchOpenApiAction,
  importDocsAction,
} from "@/app/actions/swagger-import";
import { generateDocsFromSpec } from "@/features/swagger-import/generateDocs";
import { parseControllers } from "@/features/swagger-import/parseOpenApi";
import type {
  ControllerGroup,
  ImportState,
  OpenApiSpec,
  ParsedController,
} from "@/features/swagger-import/components/model/index";

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS = [
  { key: "url", label: "آدرس API" },
  { key: "select", label: "انتخاب" },
  { key: "result", label: "نتیجه" },
] as const;

type Step = (typeof STEPS)[number]["key"];

const METHOD_STYLES: Record<string, string> = {
  get:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  post:   "bg-sky-50 text-sky-700 border-sky-200",
  put:    "bg-amber-50 text-amber-700 border-amber-200",
  patch:  "bg-violet-50 text-violet-700 border-violet-200",
  delete: "bg-rose-50 text-rose-700 border-rose-200",
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function detectUrlHint(url: string): string | null {
  if (!url.trim()) return null;
  const lower = url.toLowerCase();
  if (lower.includes("index.html") || lower.match(/\/swagger\/?$/)) {
    return "آدرس Swagger UI هست. برای NestJS آدرس JSON رو امتحان کن: /swagger-json | برای سایرین: /api-json یا /openapi.json";
  }
  return null;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  done   ? "bg-(--lightBlue) text-white ring-4 ring-(--lightBlue)/20"
                : active ? "bg-(--darkBlue) text-white ring-4 ring-(--darkBlue)/15"
                :          "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  active ? "text-(--darkBlue)"
                : done   ? "text-(--lightBlue)"
                :          "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 mb-4 h-0.5 w-10 transition-all duration-500 ${done ? "bg-(--lightBlue)" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  size = "md",
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  size?: "sm" | "md";
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`shrink-0 rounded accent-(--lightBlue) ${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}`}
    />
  );
}

function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl px-4 py-2 ${
        accent ? "bg-(--darkBlue) text-white" : "bg-slate-100 text-slate-700"
      }`}
    >
      <span className={`text-lg font-bold leading-none ${accent ? "text-white" : "text-(--darkBlue)"}`}>
        {value}
      </span>
      <span className={`mt-0.5 text-[11px] ${accent ? "text-white/70" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SwaggerImportWizard() {
  // ── Wizard state
  const [step,          setStep]          = useState<Step>("url");
  const [state,         setState]         = useState<ImportState>("idle");
  const [error,         setError]         = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  // ── URL step
  const [url, setUrl] = useState("");

  // ── Select step
  const [spec,        setSpec]        = useState<OpenApiSpec | null>(null);
  const [controllers, setControllers] = useState<ParsedController[]>([]);
  const [groups,      setGroups]      = useState<ControllerGroup[]>([]);
  const [search,      setSearch]      = useState("");
  const [expanded,       setExpanded]       = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // ── Group creation
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newGroupName,  setNewGroupName]  = useState("");
  const [newGroupTags,  setNewGroupTags]  = useState<Set<string>>(new Set());

  // ── Derived
  const groupedTagSet       = new Set(groups.flatMap((g) => g.tags));
  const ungroupedControllers = controllers.filter((c) => !groupedTagSet.has(c.tag));
  const availableForGroup    = ungroupedControllers; // only ungrouped can be added to a new group

  const filteredUngrouped = search.trim()
    ? ungroupedControllers.filter((c) =>
        c.customName.toLowerCase().includes(search.toLowerCase()) ||
        c.tag.toLowerCase().includes(search.toLowerCase()),
      )
    : ungroupedControllers;

  const selectedUngroupedCount = ungroupedControllers.filter((c) => c.selected).length;
  const totalPageCount         = selectedUngroupedCount + groups.length;
  const totalEndpointCount     = controllers
    .filter((c) => c.selected || groupedTagSet.has(c.tag))
    .reduce((s, c) => s + c.endpoints.filter((e) => e.selected).length, 0);

  const urlHint = detectUrlHint(url);

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleFetch() {
    if (!url.trim()) return;
    setState("loading");
    setError(null);

    const result = await fetchOpenApiAction(url);
    if (result.error || !result.spec) {
      setError(result.error ?? "خطای ناشناخته");
      setState("error");
      return;
    }

    const parsed = parseControllers(result.spec);
    if (parsed.length === 0) {
      setError("هیچ controller ای در spec یافت نشد.");
      setState("error");
      return;
    }

    setSpec(result.spec);
    setControllers(parsed);
    setGroups([]);
    setSearch("");
    setState("parsed");
    setStep("select");
  }

  function toggleController(tag: string) {
    setControllers((prev) =>
      prev.map((c) => {
        if (c.tag !== tag) return c;
        const next = !c.selected;
        return { ...c, selected: next, endpoints: c.endpoints.map((e) => ({ ...e, selected: next })) };
      }),
    );
  }

  function toggleEndpoint(tag: string, index: number) {
    setControllers((prev) =>
      prev.map((c) => {
        if (c.tag !== tag) return c;
        const endpoints = c.endpoints.map((e, i) =>
          i === index ? { ...e, selected: !e.selected } : e,
        );
        return { ...c, endpoints, selected: endpoints.some((e) => e.selected) };
      }),
    );
  }

  function selectAllEndpoints(tag: string, all: boolean) {
    setControllers((prev) =>
      prev.map((c) => {
        if (c.tag !== tag) return c;
        return {
          ...c,
          selected: all,
          endpoints: c.endpoints.map((e) => ({ ...e, selected: all })),
        };
      }),
    );
  }

  function toggleAll() {
    const allSelected = ungroupedControllers.every((c) => c.selected);
    setControllers((prev) =>
      prev.map((c) => {
        if (groupedTagSet.has(c.tag)) return c;
        return { ...c, selected: !allSelected, endpoints: c.endpoints.map((e) => ({ ...e, selected: !allSelected })) };
      }),
    );
  }

  function updateName(tag: string, name: string) {
    setControllers((prev) =>
      prev.map((c) => (c.tag === tag ? { ...c, customName: name } : c)),
    );
  }

  function toggleExpand(tag: string) {
    setExpanded((prev) => { const s = new Set(prev); s.has(tag) ? s.delete(tag) : s.add(tag); return s; });
  }

  function toggleGroupExpand(id: string) {
    setExpandedGroups((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function updateGroupName(id: string, name: string) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
  }

  function deleteGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  function removeFromGroup(groupId: string, tag: string) {
    setGroups((prev) =>
      prev
        .map((g) => (g.id === groupId ? { ...g, tags: g.tags.filter((t) => t !== tag) } : g))
        .filter((g) => g.tags.length >= 1),
    );
  }

  function confirmCreateGroup() {
    if (!newGroupName.trim() || newGroupTags.size < 2) return;
    setGroups((prev) => [...prev, { id: uid(), name: newGroupName.trim(), tags: Array.from(newGroupTags) }]);
    setNewGroupName("");
    setNewGroupTags(new Set());
    setCreatingGroup(false);
  }

  async function handleImport() {
    if (!spec) return;
    const selected = controllers.filter((c) => c.selected || groupedTagSet.has(c.tag));
    if (totalPageCount === 0) return;

    setState("importing");
    setError(null);

    const { menuGroups, pages } = generateDocsFromSpec(spec, selected, groups);
    const result = await importDocsAction(menuGroups, pages);

    if (!result.success) {
      setError(result.error ?? "خطا در ذخیره داکیومنت");
      setState("error");
      return;
    }

    setImportedCount(result.count);
    setState("done");
    setStep("result");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-(--darkGray)">
              Swagger / OpenAPI Import
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold text-slate-950">
              ایجاد داکیومنت از API
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              لینک JSON spec رو بده — صفحات داکیومنت بصورت خودکار ساخته میشن
            </p>
          </div>
          <StepIndicator current={step} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 1 — URL
      ═══════════════════════════════════════════════════════════════════ */}
      {step === "url" && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Icon + title */}
          <div className="flex flex-col items-center border-b border-slate-100 px-8 py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--darkBlue)/10">
              <Globe className="h-8 w-8 text-(--darkBlue)" />
            </div>
            <h2 className="text-lg font-semibold text-slate-950">
              آدرس Swagger / OpenAPI
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              آدرس فایل JSON spec رو وارد کن. این آدرس باید JSON برگردونه، نه صفحه HTML.
            </p>
          </div>

          {/* Input */}
          <div className="mx-auto max-w-2xl space-y-4 px-8 py-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="swagger-url"
                  type="url"
                  dir="ltr"
                  value={url}
                  autoFocus
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) { setError(null); setState("idle"); }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                  placeholder="https://api.example.com/swagger-json"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-(--lightBlue) focus:bg-white focus:ring-2 focus:ring-(--lightBlue)/20"
                />
              </div>
              <button
                type="button"
                onClick={handleFetch}
                disabled={state === "loading" || !url.trim()}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-(--darkBlue) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--lightBlue) disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === "loading"
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> در حال بارگذاری...</>
                  : <><Zap className="h-4 w-4" /> بارگذاری</>
                }
              </button>
            </div>

            {/* Smart URL hint */}
            {urlHint && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white">
                  <span className="text-[10px] font-bold">!</span>
                </div>
                <p className="text-sm text-amber-800">{urlHint}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                <div>
                  <p className="text-sm font-medium text-rose-800">بارگذاری ناموفق</p>
                  <p className="mt-0.5 text-sm text-rose-700">{error}</p>
                </div>
              </div>
            )}

            {/* Format hints */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                فرمت‌های رایج
              </p>
              <div className="space-y-1.5">
                {[
                  { label: "NestJS",       path: "/swagger-json" },
                  { label: "Express/Koa",  path: "/api-json" },
                  { label: "Spring Boot",  path: "/v3/api-docs" },
                  { label: "Swagger 2.0",  path: "/swagger.json" },
                ].map(({ label, path }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-medium text-slate-500">{label}</span>
                    <code className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700" dir="ltr">
                      https://your-api.com{path}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 2 — SELECT
      ═══════════════════════════════════════════════════════════════════ */}
      {step === "select" && (
        <div className="space-y-4">

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <StatChip label="کنترولر" value={controllers.length} />
            <StatChip label="گروه"    value={groups.length} />
            <StatChip label="API انتخاب" value={totalEndpointCount} />
            <StatChip label="صفحه"    value={totalPageCount} accent />
          </div>

          {/* Group creation panel */}
          {creatingGroup && (
            <div className="rounded-3xl border border-(--darkBlue)/25 bg-linear-to-b from-(--darkBlue)/8 to-(--darkBlue)/4 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-(--darkBlue)" />
                  <h3 className="font-semibold text-slate-950">ایجاد گروه جدید</h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setCreatingGroup(false); setNewGroupName(""); setNewGroupTags(new Set()); }}
                  className="rounded-xl p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    نام گروه (عنوان صفحه داکیومنت)
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmCreateGroup();
                      if (e.key === "Escape") { setCreatingGroup(false); setNewGroupName(""); setNewGroupTags(new Set()); }
                    }}
                    placeholder="مثلاً: مدیریت کاربران و احراز هویت"
                    autoFocus
                    className="w-full rounded-2xl border border-white bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-(--lightBlue) focus:ring-2 focus:ring-(--lightBlue)/20"
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-600">
                    کنترولرها را انتخاب کنید
                    <span className="mr-1 text-slate-400">(حداقل ۲)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableForGroup.map((c) => {
                      const checked = newGroupTags.has(c.tag);
                      return (
                        <button
                          key={c.tag}
                          type="button"
                          onClick={() =>
                            setNewGroupTags((prev) => {
                              const s = new Set(prev);
                              s.has(c.tag) ? s.delete(c.tag) : s.add(c.tag);
                              return s;
                            })
                          }
                          className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-medium transition ${
                            checked
                              ? "border-(--darkBlue) bg-(--darkBlue) text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {checked && <CheckCircle2 className="h-3 w-3" />}
                          {c.customName || c.tag}
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${checked ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                            {c.endpointCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={confirmCreateGroup}
                    disabled={!newGroupName.trim() || newGroupTags.size < 2}
                    className="flex items-center gap-2 rounded-2xl bg-(--darkBlue) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--lightBlue) disabled:opacity-50"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    ایجاد گروه ({newGroupTags.size} کنترولر)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCreatingGroup(false); setNewGroupName(""); setNewGroupTags(new Set()); }}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main list card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی کنترولر..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-(--lightBlue) focus:bg-white focus:ring-2 focus:ring-(--lightBlue)/20"
                />
              </div>
              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {availableForGroup.length >= 2 && !creatingGroup && (
                  <button
                    type="button"
                    onClick={() => setCreatingGroup(true)}
                    className="flex items-center gap-1.5 rounded-2xl border border-(--darkBlue)/30 bg-(--darkBlue)/8 px-3 py-2 text-sm font-medium text-(--darkBlue) transition hover:bg-(--darkBlue)/15"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    گروه‌بندی
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleAll}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  {ungroupedControllers.every((c) => c.selected) ? "لغو همه" : "انتخاب همه"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("url"); setState("idle"); }}
                  className="flex items-center gap-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  برگشت
                </button>
              </div>
            </div>

            {/* ── Groups section ── */}
            {groups.length > 0 && (
              <div className="border-b border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50/80 px-5 py-2">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    گروه‌ها ({groups.length})
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {groups.map((group) => {
                    const isExp   = expandedGroups.has(group.id);
                    const members = controllers.filter((c) => group.tags.includes(c.tag));
                    const epCount = members.reduce(
                      (s, c) => s + c.endpoints.filter((e) => e.selected).length, 0,
                    );
                    const totalEp = members.reduce((s, c) => s + c.endpointCount, 0);
                    return (
                      <div key={group.id}>
                        <div className="flex items-center gap-3 bg-(--darkBlue)/3 px-5 py-3.5 transition hover:bg-(--darkBlue)/6">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--darkBlue)/15">
                            <Layers className="h-4 w-4 text-(--darkBlue)" />
                          </div>
                          <input
                            type="text"
                            value={group.name}
                            onChange={(e) => updateGroupName(group.id, e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none transition border-b border-transparent focus:border-slate-400"
                          />
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="hidden rounded-full bg-(--darkBlue)/10 px-3 py-1 text-xs font-semibold text-(--darkBlue) sm:inline-flex">
                              {members.length} ctrl
                            </span>
                            <span className="rounded-full bg-(--lightBlue)/10 px-3 py-1 text-xs font-semibold text-(--lightBlue)">
                              {epCount}/{totalEp} API
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteGroup(group.id)}
                              title="حذف گروه"
                              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleGroupExpand(group.id)}
                              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100"
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExp ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </div>

                        {isExp && (
                          <div className="bg-slate-50/60">
                            {members.map((c) => (
                              <div key={c.tag} className="flex items-center gap-3 border-t border-slate-100 px-14 py-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                                  <Code2 className="h-3 w-3 text-slate-500" />
                                </div>
                                <span className="flex-1 text-sm text-slate-700">{c.customName || c.tag}</span>
                                <span className="text-xs text-slate-400">
                                  {c.endpoints.filter((e) => e.selected).length}/{c.endpointCount} API
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFromGroup(group.id, c.tag)}
                                  className="rounded-xl px-2 py-1 text-xs text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                                >
                                  حذف از گروه
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Controllers section ── */}
            {ungroupedControllers.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50/80 px-5 py-2 border-b border-slate-100">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  کنترولرها ({ungroupedControllers.length})
                  {search && ` · ${filteredUngrouped.length} نتیجه`}
                </span>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {filteredUngrouped.length === 0 && search && (
                <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                  <Search className="h-8 w-8 opacity-40" />
                  <p className="text-sm">نتیجه‌ای یافت نشد</p>
                </div>
              )}

              {filteredUngrouped.map((controller) => {
                const isExpanded   = expanded.has(controller.tag);
                const selEp        = controller.endpoints.filter((e) => e.selected).length;
                const allEp        = controller.endpointCount;
                const indeterminate = !controller.selected && selEp > 0;

                return (
                  <div key={controller.tag}>
                    {/* Controller row */}
                    <div className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50">
                      <IndeterminateCheckbox
                        checked={controller.selected}
                        indeterminate={indeterminate}
                        onChange={() => toggleController(controller.tag)}
                      />
                      <input
                        type="text"
                        value={controller.customName}
                        onChange={(e) => updateName(controller.tag, e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none transition border-b border-transparent focus:border-slate-300"
                        dir="ltr"
                        title="نام قابل ویرایش است"
                      />
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            selEp === allEp
                              ? "bg-(--lightBlue)/10 text-(--lightBlue)"
                              : selEp > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {selEp}/{allEp} API
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleExpand(controller.tag)}
                          title={isExpanded ? "بستن لیست API‌ها" : "مشاهده API‌ها"}
                          className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Endpoints accordion */}
                    {isExpanded && (
                      <div className="border-t border-slate-50 bg-slate-50/70">
                        {/* Endpoint toolbar */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-9 py-2">
                          <span className="text-xs text-slate-400">{allEp} endpoint</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => selectAllEndpoints(controller.tag, true)}
                              className="text-xs text-slate-500 transition hover:text-(--lightBlue)"
                            >
                              انتخاب همه
                            </button>
                            <span className="text-slate-300">·</span>
                            <button
                              type="button"
                              onClick={() => selectAllEndpoints(controller.tag, false)}
                              className="text-xs text-slate-500 transition hover:text-rose-500"
                            >
                              لغو همه
                            </button>
                          </div>
                        </div>

                        {controller.endpoints.map((ep, i) => (
                          <label
                            key={`${ep.method}-${ep.path}-${i}`}
                            className="flex cursor-pointer items-center gap-3 px-9 py-2.5 transition hover:bg-slate-100"
                          >
                            <IndeterminateCheckbox
                              checked={ep.selected}
                              indeterminate={false}
                              onChange={() => toggleEndpoint(controller.tag, i)}
                              size="sm"
                            />
                            <span
                              className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                METHOD_STYLES[ep.method] ?? "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {ep.method}
                            </span>
                            <span className="flex-1 truncate font-mono text-xs text-slate-600" dir="ltr">
                              {ep.path}
                            </span>
                            {ep.summary && (
                              <span className="hidden max-w-52 shrink-0 truncate text-xs text-slate-400 sm:block">
                                {ep.summary}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer bar */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-4">
              <div className="flex items-center gap-3">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-rose-600">
                    <XCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-950">{totalPageCount} صفحه</p>
                  <p className="text-xs text-slate-400">{totalEndpointCount} API انتخاب شده</p>
                </div>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={state === "importing" || totalPageCount === 0}
                  className="flex items-center gap-2 rounded-2xl bg-(--darkBlue) px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--lightBlue) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {state === "importing"
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> در حال ساخت...</>
                    : <><Zap className="h-4 w-4" /> تولید داکیومنت</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STEP 3 — RESULT
      ═══════════════════════════════════════════════════════════════════ */}
      {step === "result" && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center px-8 py-14 text-center">
            {/* Animated success ring */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-60" style={{ animationDuration: "2s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-slate-950">داکیومنت ساخته شد</h2>
            <p className="mt-2 text-slate-500">Swagger spec با موفقیت به داکیومنت تبدیل شد</p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <StatChip label="صفحه ساخته شد" value={importedCount} accent />
              <StatChip label="API اضافه شد"   value={totalEndpointCount} />
              <StatChip label="گروه"           value={groups.length} />
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-2xl bg-(--darkBlue) px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--lightBlue)"
              >
                <FileText className="h-4 w-4" />
                مشاهده در داکیومنت ساز
              </Link>
              <Link
                href="/pages"
                className="flex items-center gap-2 rounded-2xl border border-slate-200 px-7 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                پیش‌نمایش داکیومنت
              </Link>
              <button
                type="button"
                onClick={() => { setStep("url"); setState("idle"); setUrl(""); setControllers([]); setGroups([]); }}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 px-7 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
              >
                <Globe className="h-4 w-4" />
                ورود مجدد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
