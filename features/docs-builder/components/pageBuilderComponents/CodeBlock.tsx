"use client";

import { useState } from "react";
import type { CodeComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";
import { getFontSizeValue } from "../../utils/textStyle";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

export function CodeBlock({ component }: PageBlockProps<CodeComponent>) {
  const codeStyle = component.style;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(component.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-xl"
      style={{
        backgroundColor: codeStyle?.backgroundColor,
        borderColor: codeStyle?.borderColor,
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3"
        style={{ borderColor: codeStyle?.borderColor }}
      >
        <div className="flex items-center gap-3">
          {/* Mac dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <p
            className="text-sm font-medium text-slate-200"
            style={{ color: codeStyle?.titleColor }}
          >
            {component.title ?? "Code Example"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-400">
            {component.language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "کپی شد" : "کپی"}
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={component.language || "javascript"}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "transparent",
          fontSize: getFontSizeValue(codeStyle?.fontSize) ?? "0.8125rem",
        }}
      >
        {component.code}
      </SyntaxHighlighter>
    </div>
  );
}
