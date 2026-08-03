"use client";

import { BlockCapabilityPanel } from "@/features/componentsSetting/components/BlockCapabilityPanel";
import { BlockRegistryPanel } from "@/features/componentsSetting/components/BlockRegistryPanel";

export function ComponentsSettingView() {
  return (
    <div className="space-y-6">
      <div
        className="
        rounded-3xl 
        border 
        border-slate-200 
        bg-white 
        p-6 
        shadow-sm
        sm:p-8
      "
      >
        <p
          className="
          text-xs 
          font-medium 
          uppercase 
          tracking-[0.24em] 
          text-sky-600
        "
        >
          Components Setting
        </p>

        <h1
          className="
          mt-2 
          text-2xl 
          font-semibold 
          text-slate-950
        "
        >
          تنظیمات کامپوننت‌ها
        </h1>

        <p className="mt-2 text-slate-500">
          از این بخش می‌توانید کامپوننت‌های سیستم را مدیریت و پیکربندی کنید.
        </p>
      </div>

      <BlockRegistryPanel />

      <BlockCapabilityPanel />
    </div>
  );
}
