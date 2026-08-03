export type OpenApiTag = {
  name: string;
  description?: string;
};

export type OpenApiParameter = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required?: boolean;
  description?: string;
  schema?: { type?: string; format?: string; description?: string };
};

export type OpenApiSchema = {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, OpenApiSchema>;
  items?: OpenApiSchema;
  required?: string[];
  $ref?: string;
};

export type OpenApiOperation = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenApiParameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: OpenApiSchema }>;
  };
  responses?: Record<
    string,
    { description?: string; content?: Record<string, { schema?: OpenApiSchema }> }
  >;
};

export type OpenApiSpec = {
  openapi?: string;
  swagger?: string;
  info?: { title?: string; description?: string; version?: string };
  tags?: OpenApiTag[];
  paths?: Record<string, Record<string, OpenApiOperation>>;
  components?: {
    schemas?: Record<string, OpenApiSchema>;
  };
};

export type ParsedEndpoint = {
  method: string;
  path: string;
  summary?: string;
  selected: boolean;
};

export type ParsedController = {
  tag: string;
  customName: string;
  description?: string;
  endpointCount: number;
  selected: boolean;
  endpoints: ParsedEndpoint[];
};

export type ControllerGroup = {
  id: string;
  name: string;
  tags: string[];
  /** Individual endpoints added to the group as `controllerTag\u0000endpointIndex`. */
  endpointKeys?: string[];
};

export type ImportState =
  | "idle"
  | "loading"
  | "parsed"
  | "importing"
  | "done"
  | "error";
