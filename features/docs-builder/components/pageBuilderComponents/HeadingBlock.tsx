import type { HeadingComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";
import { buildTextStyle } from "../../utils/textStyle";

const levelClasses: Record<1 | 2 | 3, string> = {
  1: "text-3xl font-bold tracking-tight text-slate-900 border-b-2 border-slate-200 pb-3",
  2: "text-2xl font-semibold tracking-tight text-slate-900",
  3: "text-lg font-semibold text-slate-800",
};

export function HeadingBlock({ component }: PageBlockProps<HeadingComponent>) {
  const level = (component.level ?? 1) as 1 | 2 | 3;
  const Tag = level === 2 ? "h2" : level === 3 ? "h3" : "h1";

  return (
    <Tag
      className={`text-pretty ${levelClasses[level]}`}
      style={buildTextStyle(component.style)}
    >
      {component.text}
    </Tag>
  );
}
