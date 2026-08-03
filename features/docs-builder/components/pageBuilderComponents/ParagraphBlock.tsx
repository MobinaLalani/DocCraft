import type { ParagraphComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";
import { buildTextStyle } from "../../utils/textStyle";

export function ParagraphBlock({
  component,
}: PageBlockProps<ParagraphComponent>) {
  return (
    <p
      className="max-w-3xl text-base leading-8 text-slate-600"
      style={buildTextStyle(component.style)}
    >
      {component.text}
    </p>
  );
}
