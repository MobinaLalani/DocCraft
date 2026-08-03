export type PageComponentType =
  | "heading"
  | "note"
  | "paragraph"
  | "endpoint"
  | "field-group"
  | "table"
  | "code";

export type HeadingLevel = 1 | 2 | 3;
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ApiFieldKind = "headers" | "query" | "path" | "body" | "response";
export type CodeLanguage = "json" | "bash" | "javascript" | "typescript";
export type FontSizeToken = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
export type FontWeightToken = "normal" | "medium" | "semibold" | "bold";
export type TextAlignToken = "right" | "center" | "left";
export type LineHeightToken = "normal" | "relaxed" | "loose";

export type TextStyle = {
  color?: string;
  fontSize?: FontSizeToken;
  fontWeight?: FontWeightToken;
  italic?: boolean;
  underline?: boolean;
  align?: TextAlignToken;
  lineHeight?: LineHeightToken;
};

export type TableStyle = {
  titleColor?: string;
  borderColor?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  bodyTextColor?: string;
  rowStripeColor?: string;
  textSize?: FontSizeToken;
  headerFontWeight?: FontWeightToken;
};

export type EndpointStyle = {
  titleColor?: string;
  summaryColor?: string;
  pathBackgroundColor?: string;
  pathTextColor?: string;
};

export type CodeStyle = {
  titleColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  fontSize?: FontSizeToken;
};

export type NoteTone = "info" | "success" | "warning" | "danger";

export type CapabilityOverrides = {
  properties?: Record<string, boolean>;
  style?: Record<string, boolean>;
  behavior?: Record<string, boolean>;
};

export type BaseComponent = {
  id: string;
  type: PageComponentType;
  capabilityOverrides?: CapabilityOverrides;
};

export type HeadingComponent = BaseComponent & {
  type: "heading";
  text: string;
  level?: HeadingLevel;
  style?: TextStyle;
};

export type ParagraphComponent = BaseComponent & {
  type: "paragraph";
  text: string;
  style?: TextStyle;
};

export type NoteComponent = BaseComponent & {
  type: "note";
  title: string;
  text: string;
  tone?: NoteTone;
  style?: TextStyle;
};

export type EndpointComponent = BaseComponent & {
  type: "endpoint";
  title: string;
  method: HttpMethod;
  path: string;
  summary: string;
  auth?: string;
  requestContentType?: string;
  responseContentType?: string;
  requestExample?: string;
  responseExample?: string;
  responseStatus?: number;
  style?: EndpointStyle;
};

export type ApiField = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type FieldGroupComponent = BaseComponent & {
  type: "field-group";
  title: string;
  kind: ApiFieldKind;
  fields: ApiField[];
};

export type TableColumn = {
  title: string;
  field: string;
};

export type TableRow = Record<string, string | number | null>;

export type TableComponent = BaseComponent & {
  type: "table";
  title?: string;
  columns: TableColumn[];
  rows?: TableRow[];
  emptyMessage?: string;
  style?: TableStyle;
};

export type CodeComponent = BaseComponent & {
  type: "code";
  title?: string;
  language: CodeLanguage;
  code: string;
  style?: CodeStyle;
};

export type PageComponent =
  | HeadingComponent
  | NoteComponent
  | ParagraphComponent
  | EndpointComponent
  | FieldGroupComponent
  | TableComponent
  | CodeComponent;

export type DocPage = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  menuGroupId: string;
  menuTitle: string;
  components: PageComponent[];
};

export const createDefaultPage = (): DocPage => ({
  id: 0,
  slug: "",
  title: "",
  description: "",
  menuGroupId: "",
  menuTitle: "",
  components: [],
});
