"use client";

import Link from "next/link";

import { CheckCircle2, FileText, Globe } from "lucide-react";

import { StatChip } from "../shared/StatChip";

type Props = {
  importedCount: number;

  endpointCount: number;

  groupCount: number;

  reset: () => void;
};

export function ResultStep({
  importedCount,
  endpointCount,
  groupCount,
  reset,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />

        <h2 className="mt-5 text-2xl font-semibold">
          عملیات با موفقیت انجام شد
        </h2>

        <div className="mt-8 flex justify-center gap-3">
          <StatChip label="Pages" value={importedCount} />

          <StatChip label="Endpoints" value={endpointCount} />

          <StatChip label="Groups" value={groupCount} />
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <Link
            href="/admin"
            className="rounded-xl bg-(--darkBlue) px-6 py-3 text-white"
          >
            <FileText className="mr-2 inline h-4 w-4" />
            مشاهده
          </Link>

          <button onClick={reset} className="rounded-xl border px-6 py-3">
            <Globe className="mr-2 inline h-4 w-4" />
            Import جدید
          </button>
        </div>
      </div>
    </div>
  );
}
