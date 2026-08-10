import Image from "next/image";
import { ImageUp } from "lucide-react";

import type { ImageComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";

export function ImageBlock({ component }: PageBlockProps<ImageComponent>) {
  if (!component.src) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        <ImageUp size={30} aria-hidden="true" />
        <p className="text-sm">از پنل تنظیمات یک تصویر انتخاب کن.</p>
      </div>
    );
  }

  const width = component.width ?? 1200;
  const height = component.height ?? 675;
  const borderWidth = component.style?.borderWidth ?? 1;
  const borderColor = component.style?.borderColor ?? "#e2e8f0";
  const borderRadius = component.style?.borderRadius ?? 12;

  return (
    <figure className="space-y-3">
      <div
        className="relative mx-auto max-w-full overflow-hidden bg-slate-50"
        style={{
          width,
          height,
          borderWidth,
          borderColor,
          borderStyle: borderWidth > 0 ? "solid" : "none",
          borderRadius,
        }}
      >
        <Image
          unoptimized
          src={component.src}
          alt={component.alt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-contain"
        />
      </div>
      {component.caption ? (
        <figcaption className="text-center text-sm text-slate-500">{component.caption}</figcaption>
      ) : null}
    </figure>
  );
}
