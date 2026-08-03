"use client";

import type { HttpMethod } from "../model/index";

const styles: Record<HttpMethod, string> = {
  get: "bg-emerald-50 text-emerald-700 border-emerald-200",

  post: "bg-sky-50 text-sky-700 border-sky-200",

  put: "bg-amber-50 text-amber-700 border-amber-200",

  patch: "bg-violet-50 text-violet-700 border-violet-200",

  delete: "bg-rose-50 text-rose-700 border-rose-200",
};

type Props = {
  method: HttpMethod;
};

export function MethodBadge({ method }: Props) {
  return (
    <span
      className={`
        rounded
        border
        px-2
        py-1
        text-[10px]
        font-bold
        uppercase

        ${styles[method]}
      `}
    >
      {method}
    </span>
  );
}
