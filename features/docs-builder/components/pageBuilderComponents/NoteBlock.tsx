import type { NoteComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";
import { buildTextStyle } from "../../utils/textStyle";
import { Info, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import type { ElementType } from "react";

const toneConfig: Record<
  NonNullable<NoteComponent["tone"]>,
  {
    wrapper: string;
    rightBorder: string;
    icon: string;
    label: string;
    Icon: ElementType;
  }
> = {
  info: {
    wrapper: "bg-sky-50 border-sky-200",
    rightBorder: "border-r-sky-400",
    icon: "text-sky-500",
    label: "اطلاع",
    Icon: Info,
  },
  success: {
    wrapper: "bg-emerald-50 border-emerald-200",
    rightBorder: "border-r-emerald-400",
    icon: "text-emerald-500",
    label: "موفقیت",
    Icon: CheckCircle,
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200",
    rightBorder: "border-r-amber-400",
    icon: "text-amber-500",
    label: "هشدار",
    Icon: AlertTriangle,
  },
  danger: {
    wrapper: "bg-rose-50 border-rose-200",
    rightBorder: "border-r-rose-400",
    icon: "text-rose-500",
    label: "خطر",
    Icon: AlertCircle,
  },
};

export function NoteBlock({ component }: PageBlockProps<NoteComponent>) {
  const tone = component.tone ?? "info";
  const config = toneConfig[tone];
  const { Icon } = config;

  return (
    <section
      dir="rtl"
      className={`rounded-xl border border-r-4 p-5 ${config.wrapper} ${config.rightBorder}`}
      style={buildTextStyle(component.style)}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <Icon size={18} className={config.icon} />
        <span className="text-sm font-bold text-slate-800">
          {component.title || config.label}
        </span>
      </div>
      <p className="pr-7 text-sm leading-relaxed text-slate-600">
        {component.text}
      </p>
    </section>
  );
}
