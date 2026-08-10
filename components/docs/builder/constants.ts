import type { PageComponent, PageComponentType } from "@/lib/docs/schema";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Braces,
  Heading1,
  Network,
  ImageUp,
  Rows3,
  StickyNote,
  Table,
} from "lucide-react";

export const paletteTransferKey = "application/x-docs-palette";
export const componentTransferKey = "application/x-docs-component-id";

const blockTypeLabels: Record<PageComponentType, string> = {
  heading: "هدینگ",
  note: "نوت",
  paragraph: "پاراگراف",
  endpoint: "اندپوینت",
  "field-group": "گروه فیلد",
  table: "جدول",
  code: "کد نمونه",
  image: "آپلود تصویر",
};

const blockTypeIcons: Record<PageComponentType, LucideIcon> = {
  heading: Heading1,
  note: StickyNote,
  paragraph: AlignLeft,
  endpoint: Network,
  "field-group": Rows3,
  table: Table,
  code: Braces,
  image: ImageUp,
};

export function getBlockTypeLabel(type: PageComponentType) {
  return blockTypeLabels[type];
}

export function getBlockTypeIcon(type: PageComponentType) {
  return blockTypeIcons[type];
}

export function getBlockLabel(component: PageComponent) {
  if (component.type === "heading") {
    return component.text;
  }

  if (component.type === "note") {
    return component.title;
  }

  if (component.type === "paragraph") {
    return component.text.slice(0, 40) || "پاراگراف";
  }

  if (component.type === "endpoint") {
    return `${component.method} ${component.path}`;
  }

  if (component.type === "field-group") {
    return component.title;
  }

  if (component.type === "table") {
    return component.title ?? "جدول";
  }

  if (component.type === "image") {
    return component.caption || component.alt || "تصویر";
  }

  return component.title ?? "کد نمونه";
}

export function getBlockMeta(component: PageComponent) {
  if (component.type === "heading") {
    return `هدینگ سطح ${component.level ?? 1}`;
  }

  if (component.type === "note") {
    return "یادداشت برجسته";
  }

  if (component.type === "paragraph") {
    return "متن توضیحی";
  }

  if (component.type === "endpoint") {
    return component.title;
  }

  if (component.type === "field-group") {
    return `${component.fields.length} فیلد`;
  }

  if (component.type === "table") {
    return `${component.columns.length} ستون`;
  }

  if (component.type === "image") {
    return component.width && component.height
      ? `${component.width} × ${component.height}`
      : "تصویر آپلودی";
  }

  return component.language;
}

export function translateBlockLabel(label: string) {
  const labels: Record<string, string> = {
    Heading: blockTypeLabels.heading,
    Note: blockTypeLabels.note,
    Paragraph: blockTypeLabels.paragraph,
    Endpoint: blockTypeLabels.endpoint,
    "Field Group": blockTypeLabels["field-group"],
    Table: blockTypeLabels.table,
    "Code Example": blockTypeLabels.code,
    "Image Upload": blockTypeLabels.image,
  };

  return labels[label] ?? label;
}

export function translateBlockDescription(type: PageComponentType) {
  const descriptions: Record<PageComponentType, string> = {
    heading: "برای عنوان بخش ها و تیترهای اصلی",
    note: "برای نکته مهم، هشدار، راهنما و پیام برجسته",
    paragraph: "برای متن توضیحی، راهنما و نکات",
    endpoint: "برای نمایش method، path و اطلاعات endpoint",
    "field-group": "برای query، headers، body و response fields",
    table: "برای status code ها و جدول داده ها",
    code: "برای نمونه request و response",
    image: "برای آپلود و نمایش تصویر در صفحه",
  };

  return descriptions[type];
}
