import type {
  HttpMethod,
  OpenApiOperation,
  OpenApiSpec,
  ParsedController,
  ParsedEndpoint,
} from "../model/index";

const HTTP_METHODS: HttpMethod[] = ["get", "post", "put", "patch", "delete"];

function isHttpMethod(value: string): value is HttpMethod {
  return HTTP_METHODS.includes(value as HttpMethod);
}

function createEndpoint(
  path: string,
  method: HttpMethod,
  operation: OpenApiOperation,
): ParsedEndpoint {
  return {
    method,
    path,

    summary: operation.summary ?? operation.description ?? "",

    selected: false,
  };
}

export function parseControllers(spec: OpenApiSpec): ParsedController[] {
  const controllers = new Map<string, ParsedController>();

  Object.entries(spec.paths ?? {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!isHttpMethod(method)) {
        return;
      }

      if (!operation) {
        return;
      }

      const tag = operation.tags?.[0] ?? "General";

      const endpoint = createEndpoint(path, method, operation);

      const existing = controllers.get(tag);

      if (existing) {
        existing.endpoints.push(endpoint);

        existing.endpointCount = existing.endpoints.length;
      } else {
        controllers.set(tag, {
          tag,

          customName: tag,

          selected: false,

          endpointCount: 1,

          endpoints: [endpoint],
        });
      }
    });
  });

  return Array.from(controllers.values());
}
