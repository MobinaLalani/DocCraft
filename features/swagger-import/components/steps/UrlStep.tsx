"use client";

import { Globe, Loader2, XCircle, Zap } from "lucide-react";

import { detectUrlHint } from "../utils/detectUrlHint";

type Props = {
  url: string;
  setUrl: (value: string) => void;

  error: string | null;

  state: "idle" | "loading" | "parsed" | "importing" | "done" | "error";

  fetchSwagger: () => void;
};

export function UrlStep({ url, setUrl, error, state, fetchSwagger }: Props) {
  const hint = detectUrlHint(url);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">آدرس Swagger</h2>

          <p className="mt-2 text-sm text-slate-500">
            آدرس فایل OpenAPI JSON را وارد کنید.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

            <input
              dir="ltr"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/swagger-json"
              className="w-full rounded-2xl border px-12 py-3"
            />
          </div>

          <button
            onClick={fetchSwagger}
            disabled={state === "loading"}
            className="rounded-2xl bg-(--darkBlue) px-6 text-white"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Zap className="mr-2 inline h-4 w-4" />
                بارگذاری
              </>
            )}
          </button>
        </div>

        {hint && (
          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
            {hint}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-600">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
