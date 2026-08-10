import type {
  CodeComponent,
  EndpointComponent,
  FieldGroupComponent,
  HeadingComponent,
  ImageComponent,
  NoteComponent,
  PageComponent,
  ParagraphComponent,
  TableComponent,
} from "@/lib/docs/schema";

export type InspectorTab = "properties" | "data";

export type InspectorProps<T extends PageComponent> = {
  component: T;
  onChange: (updater: (component: T) => T) => void;
  activeTab: InspectorTab;
};

export type HeadingInspectorProps = InspectorProps<HeadingComponent>;
export type NoteInspectorProps = InspectorProps<NoteComponent>;
export type ParagraphInspectorProps = InspectorProps<ParagraphComponent>;
export type EndpointInspectorProps = InspectorProps<EndpointComponent>;
export type FieldGroupInspectorProps = InspectorProps<FieldGroupComponent>;
export type TableInspectorProps = InspectorProps<TableComponent>;
export type CodeInspectorProps = InspectorProps<CodeComponent>;
export type ImageInspectorProps = InspectorProps<ImageComponent>;
