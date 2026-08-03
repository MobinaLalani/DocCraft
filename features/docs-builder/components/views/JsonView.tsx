"use client";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";

export function JsonView() {
  const { state, actions } = useDocsBuilderContext();

  return (
    <section className="space-y-4">
      <div
        className="
          flex
          items-center
          justify-between
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <div>
          <p
            className="
            text-sm
            font-medium
            text-slate-500
          "
          >
            JSON کل ساختار
          </p>

          <p
            className="
            text-sm
            text-slate-600
          "
          >
            شامل منوها و تمام صفحه‌ها
          </p>
        </div>

        <button
          type="button"
          onClick={actions.copyJson}
          className="
            rounded-full
            bg-slate-950
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-slate-800
          "
        >
          {state.copied ? "کپی شد" : "کپی JSON"}
        </button>
      </div>

      <pre
        className="
          max-h-[680px]
          overflow-auto
          rounded-3xl
          bg-slate-950
          p-5
          text-xs
          leading-6
          text-slate-100
          shadow-sm
        "
      >
        <code>{state.jsonOutput}</code>
      </pre>
    </section>
  );
}
