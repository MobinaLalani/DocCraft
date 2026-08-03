import type {
  HttpMethod,
  OpenApiSpec,
  ParsedController,
  ParsedEndpoint,
} from "./components/model/index";

const HTTP_METHODS: readonly HttpMethod[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
];

type TagData = {
  description?: string;
  endpoints: ParsedEndpoint[];
};

export function parseControllers(spec: OpenApiSpec): ParsedController[] {
  const tagMap = new Map<string, TagData>();

  spec.tags?.forEach((tag) => {
    tagMap.set(tag.name, {
      description: tag.description,
      endpoints: [],
    });
  });

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];

      if (!operation) {
        continue;
      }

      const tags =
        operation.tags && operation.tags.length > 0
          ? operation.tags
          : ["default"];

      for (const tag of tags) {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            endpoints: [],
          });
        }

        tagMap.get(tag)!.endpoints.push({
          method,
          path,
          summary: operation.summary,
          selected: true,
        });
      }
    }
  }

  return [...tagMap.entries()]
    .filter(([, value]) => value.endpoints.length > 0)
    .map(([tag, value]) => ({
      tag,
      customName: tag,
      description: value.description,
      endpointCount: value.endpoints.length,
      selected: true,
      endpoints: value.endpoints,
    }));
}
