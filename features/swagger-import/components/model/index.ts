// model/index.ts

// ─────────────────────────────
// Wizard Steps
// ─────────────────────────────

export const SWAGGER_STEPS = ["url", "select", "result"] as const;

export type SwaggerStep = (typeof SWAGGER_STEPS)[number];

// ─────────────────────────────
// Import State
// ─────────────────────────────

export type ImportState =
  | "idle"
  | "loading"
  | "parsed"
  | "importing"
  | "done"
  | "error";

// ─────────────────────────────
// OpenAPI Types
// ─────────────────────────────

export interface OpenApiInfo {
  title?: string;
  version?: string;
}

export interface OpenApiOperation {
  tags?: string[];

  summary?: string;

  description?: string;
}

export type OpenApiPathItem = Record<string, OpenApiOperation | undefined>;
export type OpenApiSchema = {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, OpenApiSchema>;
  items?: OpenApiSchema;
  required?: string[];
  $ref?: string;
};

export interface OpenApiSpec {
  openapi?: string;
  tags?: OpenApiTag[];
  swagger?: string;
components?: {
    schemas?: Record<string, OpenApiSchema>;
  };
  info?: OpenApiInfo;

  paths?: Record<string, OpenApiPathItem>;
}

// ─────────────────────────────
// Parsed Controllers
// ─────────────────────────────

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface ParsedEndpoint {
  method: HttpMethod;

  path: string;

  summary?: string;

  selected: boolean;
}

export interface ParsedController {
  tag: string;

  customName: string;

  selected: boolean;

  endpointCount: number;

  endpoints: ParsedEndpoint[];
}

export type OpenApiTag = {
  name: string;
  description?: string;
};
// export type OpenApiSpec = {
//   openapi?: string;
//   swagger?: string;
//   info?: { title?: string; description?: string; version?: string };

//   paths?: Record<string, Record<string, OpenApiOperation>>;
//   components?: {
//     schemas?: Record<string, OpenApiSchema>;
//   };
// };
// ─────────────────────────────
// Groups
// ─────────────────────────────

export interface ControllerGroup {
  id: string;

  name: string;

  /**
   * tag های controller هایی که داخل گروه هستند
   */
  tags: string[];
  endpointKeys?: string[];
}

// ─────────────────────────────
// Import Result
// ─────────────────────────────

export interface SwaggerImportResult {
  success: boolean;

  count?: number;

  error?: string;
}

// ─────────────────────────────
// Service Responses
// ─────────────────────────────

export type FetchSwaggerResult =
  | {
      spec: OpenApiSpec;
      error?: never;
    }
  | {
      spec?: never;
      error: string;
    };
