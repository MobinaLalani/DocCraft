"use client";

import dynamic from "next/dynamic";

import type {
  CodeComponent,
  EndpointComponent,
  FieldGroupComponent,
  HeadingComponent,
  ImageComponent,
  NoteComponent,
  ParagraphComponent,
  TableComponent,
} from "@/lib/docs/schema";
import type {
  CodeInspectorProps,
  EndpointInspectorProps,
  FieldGroupInspectorProps,
  HeadingInspectorProps,
  ImageInspectorProps,
  NoteInspectorProps,
  ParagraphInspectorProps,
  TableInspectorProps,
} from "@/components/docs/builder/inspector/types";

function InspectorLoading() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
      در حال بارگذاری ویرایشگر بلوک...
    </div>
  );
}

export const inspectorRegistry = {
  heading: dynamic<HeadingInspectorProps>(
    () => import("@/components/docs/builder/inspector/HeadingInspector"),
    { loading: InspectorLoading },
  ),
  note: dynamic<NoteInspectorProps>(
    () => import("@/components/docs/builder/inspector/NoteInspector"),
    { loading: InspectorLoading },
  ),
  paragraph: dynamic<ParagraphInspectorProps>(
    () => import("@/components/docs/builder/inspector/ParagraphInspector"),
    { loading: InspectorLoading },
  ),
  endpoint: dynamic<EndpointInspectorProps>(
    () => import("@/components/docs/builder/inspector/EndpointInspector"),
    { loading: InspectorLoading },
  ),
  "field-group": dynamic<FieldGroupInspectorProps>(
    () => import("@/components/docs/builder/inspector/FieldGroupInspector"),
    { loading: InspectorLoading },
  ),
  table: dynamic<TableInspectorProps>(
    () => import("@/components/docs/builder/inspector/TableInspector"),
    { loading: InspectorLoading },
  ),
  code: dynamic<CodeInspectorProps>(
    () => import("@/components/docs/builder/inspector/CodeInspector"),
    { loading: InspectorLoading },
  ),
  image: dynamic<ImageInspectorProps>(
    () => import("@/components/docs/builder/inspector/ImageInspector"),
    { loading: InspectorLoading },
  ),
} as const;

export type InspectorRegistry = {
  heading: React.ComponentType<HeadingInspectorProps>;
  note: React.ComponentType<NoteInspectorProps>;
  paragraph: React.ComponentType<ParagraphInspectorProps>;
  endpoint: React.ComponentType<EndpointInspectorProps>;
  "field-group": React.ComponentType<FieldGroupInspectorProps>;
  table: React.ComponentType<TableInspectorProps>;
  code: React.ComponentType<CodeInspectorProps>;
  image: React.ComponentType<ImageInspectorProps>;
};

export type InspectorComponentMap = {
  heading: HeadingComponent;
  note: NoteComponent;
  paragraph: ParagraphComponent;
  endpoint: EndpointComponent;
  "field-group": FieldGroupComponent;
  table: TableComponent;
  code: CodeComponent;
  image: ImageComponent;
};
