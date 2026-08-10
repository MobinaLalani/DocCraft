import type { PageComponentType } from "@/lib/docs/schema";

// --- Generic types ---

export type BlockCapabilityConfig<
  P extends Record<string, boolean> = Record<string, boolean>,
  S extends Record<string, boolean> = Record<string, boolean>,
  B extends Record<string, boolean> = Record<string, boolean>,
> = {
  properties: P;
  style: S;
  behavior: B;
};

export type BlockCapabilityOverride<
  C extends BlockCapabilityConfig = BlockCapabilityConfig,
> = {
  properties?: Partial<C["properties"]>;
  style?: Partial<C["style"]>;
  behavior?: Partial<C["behavior"]>;
};

// --- Per-block typed configs ---

export type HeadingCapabilityConfig = BlockCapabilityConfig<
  { text: boolean; level: boolean },
  {
    color: boolean;
    fontSize: boolean;
    fontWeight: boolean;
    italic: boolean;
    underline: boolean;
    align: boolean;
    lineHeight: boolean;
  },
  { readOnly: boolean }
>;

export type ParagraphCapabilityConfig = BlockCapabilityConfig<
  { text: boolean },
  {
    color: boolean;
    fontSize: boolean;
    fontWeight: boolean;
    italic: boolean;
    underline: boolean;
    align: boolean;
    lineHeight: boolean;
  },
  { readOnly: boolean }
>;

export type NoteCapabilityConfig = BlockCapabilityConfig<
  { title: boolean; text: boolean; tone: boolean },
  {
    color: boolean;
    fontSize: boolean;
    fontWeight: boolean;
    italic: boolean;
    underline: boolean;
    align: boolean;
    lineHeight: boolean;
  },
  { readOnly: boolean; collapsible: boolean }
>;

export type EndpointCapabilityConfig = BlockCapabilityConfig<
  {
    title: boolean;
    method: boolean;
    path: boolean;
    summary: boolean;
    auth: boolean;
    requestContentType: boolean;
    responseContentType: boolean;
  },
  {
    titleColor: boolean;
    summaryColor: boolean;
    pathBackgroundColor: boolean;
    pathTextColor: boolean;
  },
  {
    readOnly: boolean;
    collapsible: boolean;
    showMethodBadge: boolean;
    expandable: boolean;
  }
>;

export type FieldGroupCapabilityConfig = BlockCapabilityConfig<
  {
    title: boolean;
    kind: boolean;
    allowAddField: boolean;
    allowRemoveField: boolean;
    allowEditField: boolean;
  },
  { color: boolean; fontSize: boolean },
  { readOnly: boolean; collapsible: boolean }
>;

export type TableCapabilityConfig = BlockCapabilityConfig<
  { title: boolean; columns: boolean; rows: boolean; emptyMessage: boolean },
  {
    titleColor: boolean;
    borderColor: boolean;
    headerBackgroundColor: boolean;
    headerTextColor: boolean;
    bodyTextColor: boolean;
    rowStripeColor: boolean;
    textSize: boolean;
    headerFontWeight: boolean;
  },
  {
    readOnly: boolean;
    collapsible: boolean;
    allowAddRow: boolean;
    allowAddColumn: boolean;
  }
>;

export type CodeCapabilityConfig = BlockCapabilityConfig<
  { title: boolean; language: boolean; code: boolean },
  {
    titleColor: boolean;
    textColor: boolean;
    backgroundColor: boolean;
    borderColor: boolean;
    fontSize: boolean;
  },
  { readOnly: boolean; showCopyButton: boolean; showLineNumbers: boolean }
>;

export type ImageCapabilityConfig = BlockCapabilityConfig<
  { src: boolean; alt: boolean; caption: boolean },
  {
    width: boolean;
    height: boolean;
    borderWidth: boolean;
    borderColor: boolean;
    borderRadius: boolean;
  },
  { readOnly: boolean }
>;

// --- Registry ---

export type BlockCapabilityRegistry = {
  heading: HeadingCapabilityConfig;
  note: NoteCapabilityConfig;
  paragraph: ParagraphCapabilityConfig;
  endpoint: EndpointCapabilityConfig;
  "field-group": FieldGroupCapabilityConfig;
  table: TableCapabilityConfig;
  code: CodeCapabilityConfig;
  image: ImageCapabilityConfig;
};

// --- Default configs ---

export const defaultHeadingCapabilities: HeadingCapabilityConfig = {
  properties: { text: true, level: true },
  style: {
    color: true,
    fontSize: true,
    fontWeight: true,
    italic: true,
    underline: true,
    align: true,
    lineHeight: true,
  },
  behavior: { readOnly: false },
};

export const defaultParagraphCapabilities: ParagraphCapabilityConfig = {
  properties: { text: true },
  style: {
    color: true,
    fontSize: true,
    fontWeight: true,
    italic: true,
    underline: true,
    align: true,
    lineHeight: true,
  },
  behavior: { readOnly: false },
};

export const defaultNoteCapabilities: NoteCapabilityConfig = {
  properties: { title: true, text: true, tone: true },
  style: {
    color: true,
    fontSize: true,
    fontWeight: true,
    italic: false,
    underline: false,
    align: true,
    lineHeight: true,
  },
  behavior: { readOnly: false, collapsible: true },
};

export const defaultEndpointCapabilities: EndpointCapabilityConfig = {
  properties: {
    title: true,
    method: true,
    path: true,
    summary: true,
    auth: true,
    requestContentType: true,
    responseContentType: true,
  },
  style: {
    titleColor: true,
    summaryColor: true,
    pathBackgroundColor: true,
    pathTextColor: true,
  },
  behavior: {
    readOnly: false,
    collapsible: true,
    showMethodBadge: true,
    expandable: true,
  },
};

export const defaultFieldGroupCapabilities: FieldGroupCapabilityConfig = {
  properties: {
    title: true,
    kind: true,
    allowAddField: true,
    allowRemoveField: true,
    allowEditField: true,
  },
  style: { color: true, fontSize: true },
  behavior: { readOnly: false, collapsible: true },
};

export const defaultTableCapabilities: TableCapabilityConfig = {
  properties: { title: true, columns: true, rows: true, emptyMessage: true },
  style: {
    titleColor: true,
    borderColor: true,
    headerBackgroundColor: true,
    headerTextColor: true,
    bodyTextColor: true,
    rowStripeColor: true,
    textSize: true,
    headerFontWeight: true,
  },
  behavior: {
    readOnly: false,
    collapsible: false,
    allowAddRow: true,
    allowAddColumn: true,
  },
};

export const defaultCodeCapabilities: CodeCapabilityConfig = {
  properties: { title: true, language: true, code: true },
  style: {
    titleColor: true,
    textColor: true,
    backgroundColor: true,
    borderColor: true,
    fontSize: true,
  },
  behavior: { readOnly: false, showCopyButton: true, showLineNumbers: false },
};

export const defaultImageCapabilities: ImageCapabilityConfig = {
  properties: { src: true, alt: true, caption: true },
  style: {
    width: true,
    height: true,
    borderWidth: true,
    borderColor: true,
    borderRadius: true,
  },
  behavior: { readOnly: false },
};

export const defaultBlockCapabilities: BlockCapabilityRegistry = {
  heading: defaultHeadingCapabilities,
  note: defaultNoteCapabilities,
  paragraph: defaultParagraphCapabilities,
  endpoint: defaultEndpointCapabilities,
  "field-group": defaultFieldGroupCapabilities,
  table: defaultTableCapabilities,
  code: defaultCodeCapabilities,
  image: defaultImageCapabilities,
};

// --- Resolver ---

export function resolveCapabilities<C extends BlockCapabilityConfig>(
  base: C,
  override?: BlockCapabilityOverride<C>,
): C {
  if (!override) return base;
  return {
    properties: override.properties
      ? { ...base.properties, ...override.properties }
      : base.properties,
    style: override.style
      ? { ...base.style, ...override.style }
      : base.style,
    behavior: override.behavior
      ? { ...base.behavior, ...override.behavior }
      : base.behavior,
  } as C;
}

export function getBlockCapabilities<T extends PageComponentType>(
  type: T,
  override?: BlockCapabilityOverride<BlockCapabilityRegistry[T]>,
): BlockCapabilityRegistry[T] {
  const base = defaultBlockCapabilities[type] as BlockCapabilityRegistry[T];
  return resolveCapabilities(
    base,
    override as BlockCapabilityOverride<BlockCapabilityRegistry[T]>,
  );
}
