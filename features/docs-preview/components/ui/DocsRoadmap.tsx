"use client";

import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import type { DocsRoadmapItem } from "../../model/getDocsRoadmap";

type DocsRoadmapProps = {
  items: DocsRoadmapItem[];
};

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.25 9.75V21h13.5V9.75" />
      <path d="M9.75 21v-6.75h4.5V21" />
    </svg>
  );
}

export function DocsRoadmap({ items }: DocsRoadmapProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="مسیر صفحه"
      className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:px-5"
    >
      <ol className="flex flex-wrap items-center justify-start gap-2 text-sm text-slate-500">
        {items.map((item, index) => {
          const content = item.isHome ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 ">
              <HomeIcon />
            </span>
          ) : (
            <span
              className={`rounded-full px-3 py-2 transition ${
                item.href
                  ? "bg-slate-50 text-slate-700  hover:text-slate-950"
                  : "bg-sky-50 font-medium text-sky-700"
              }`}
            >
              {item.label}
            </span>
          );

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href ? <Link href={item.href}>{content}</Link> : content}
              {index < items.length - 1 ? (
                <ArrowIcon
                  strokeColor="#94a3b8"
                  className="h-3.5 w-3.5 rotate-90"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
