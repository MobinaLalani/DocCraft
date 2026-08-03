import type {
  ApiField,
  DocPage,
  EndpointComponent,
  FieldGroupComponent,
  HeadingComponent,
  HttpMethod,
  ParagraphComponent,
} from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";
import type {
  ControllerGroup,
  OpenApiOperation,
  OpenApiParameter,
  OpenApiSchema,
  OpenApiSpec,
  ParsedController,
} from "./model";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function toSlug(input: string) {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "page"
  );
}

function resolveRef(
  schema: OpenApiSchema,
  schemas?: Record<string, OpenApiSchema>,
): OpenApiSchema {
  if (schema.$ref && schemas) {
    const name = schema.$ref.split("/").pop();
    if (name && schemas[name]) return schemas[name];
  }
  return schema;
}

function schemaToFields(
  schema: OpenApiSchema | undefined,
  schemas: Record<string, OpenApiSchema> | undefined,
): ApiField[] {
  if (!schema) return [];
  const resolved = resolveRef(schema, schemas);
  if (!resolved.properties) return [];
  const required = resolved.required ?? [];
  return Object.entries(resolved.properties).map(([name, prop]) => {
    const r = resolveRef(prop, schemas);
    return {
      id: uid(),
      name,
      type: r.type ?? (r.$ref ? (r.$ref.split("/").pop() ?? "object") : "object"),
      required: required.includes(name),
      description: r.description ?? "",
    };
  });
}

function paramFields(params: OpenApiParameter[], inFilter: string): ApiField[] {
  return params
    .filter((p) => p.in === inFilter)
    .map((p) => ({
      id: uid(),
      name: p.name,
      type: p.schema?.type ?? "string",
      required: p.required ?? false,
      description: p.description ?? "",
    }));
}

const HTTP_METHOD_MAP: Record<string, HttpMethod> = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
};

function buildControllerBlocks(
  controller: ParsedController,
  spec: OpenApiSpec,
  schemas: Record<string, import("./model").OpenApiSchema> | undefined,
  subHeading: boolean,
): DocPage["components"] {
  const blocks: DocPage["components"] = [];

  if (subHeading) {
    blocks.push({
      id: uid(),
      type: "heading",
      text: controller.customName.trim() || controller.tag,
      level: 2,
    } as HeadingComponent);
  }

  const selectedEndpoints = controller.endpoints.filter((e) => e.selected);

  selectedEndpoints.forEach(({ method, path }) => {
    const pathItem = spec.paths?.[path];
    if (!pathItem) return;
    const op = pathItem[method] as OpenApiOperation | undefined;
    if (!op) return;

    const httpMethod = HTTP_METHOD_MAP[method];
    if (!httpMethod) return;

    const params = op.parameters ?? [];

    blocks.push({
      id: uid(),
      type: "endpoint",
      title: op.summary ?? `${method.toUpperCase()} ${path}`,
      method: httpMethod,
      path,
      summary: op.description ?? op.summary ?? "",
      requestContentType: op.requestBody ? "application/json" : undefined,
      responseContentType: "application/json",
    } as EndpointComponent);

    const pathFields = paramFields(params, "path");
    if (pathFields.length) {
      blocks.push({ id: uid(), type: "field-group", title: "Path Parameters", kind: "path", fields: pathFields } as FieldGroupComponent);
    }
    const queryFields = paramFields(params, "query");
    if (queryFields.length) {
      blocks.push({ id: uid(), type: "field-group", title: "Query Parameters", kind: "query", fields: queryFields } as FieldGroupComponent);
    }
    const headerFields = paramFields(params, "header");
    if (headerFields.length) {
      blocks.push({ id: uid(), type: "field-group", title: "Headers", kind: "headers", fields: headerFields } as FieldGroupComponent);
    }
    const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
    const bodyFields = schemaToFields(bodySchema, schemas);
    if (bodyFields.length) {
      blocks.push({ id: uid(), type: "field-group", title: "Request Body", kind: "body", fields: bodyFields } as FieldGroupComponent);
    }
    const responses = op.responses ?? {};
    const successCode = ["200", "201"].find((c) => responses[c]);
    if (successCode) {
      const resSchema = responses[successCode]?.content?.["application/json"]?.schema;
      const resFields = schemaToFields(resSchema, schemas);
      if (resFields.length) {
        blocks.push({ id: uid(), type: "field-group", title: "Response", kind: "response", fields: resFields } as FieldGroupComponent);
      }
    }
  });

  return blocks;
}

export function generateDocsFromSpec(
  spec: OpenApiSpec,
  controllers: ParsedController[],
  groups: ControllerGroup[] = [],
): { menuGroups: MenuGroup[]; pages: DocPage[] } {
  const schemas = spec.components?.schemas;
  const menuGroups: MenuGroup[] = [];
  const pages: DocPage[] = [];

  // Process groups first — merge multiple controllers into one page
  const groupedTagSet = new Set(groups.flatMap((g) => g.tags));
  const groupedEndpointKeys = new Set(groups.flatMap((g) => g.endpointKeys ?? []));

  groups.forEach((group) => {
    const members = controllers.flatMap((controller) => {
      if (group.tags.includes(controller.tag)) return [controller];

      const endpoints = controller.endpoints.filter((_, endpointIndex) =>
        group.endpointKeys?.includes(`${controller.tag}\u0000${endpointIndex}`),
      );
      return endpoints.length > 0
        ? [{ ...controller, endpoints, endpointCount: endpoints.length, selected: true }]
        : [];
    });
    if (members.length === 0) return;

    const displayName = group.name.trim() || group.id;

    const menuGroup: MenuGroup = {
      id: `menu-${uid()}`,
      title: displayName,
      description: "",
      isActive: true,
    };
    menuGroups.push(menuGroup);

    const blocks: DocPage["components"] = [];
    blocks.push({ id: uid(), type: "heading", text: displayName, level: 1 } as HeadingComponent);

    members.forEach((controller) => {
      blocks.push(...buildControllerBlocks(controller, spec, schemas, true));
    });

    pages.push({
      id: 0,
      slug: toSlug(displayName),
      title: displayName,
      description: "",
      menuGroupId: menuGroup.id,
      menuTitle: displayName,
      components: blocks,
    });
  });

  // Process ungrouped controllers
  const ungrouped = controllers.flatMap((controller) => {
    if (groupedTagSet.has(controller.tag)) return [];

    const endpoints = controller.endpoints.filter(
      (_, endpointIndex) => !groupedEndpointKeys.has(`${controller.tag}\u0000${endpointIndex}`),
    );
    return endpoints.some((endpoint) => endpoint.selected)
      ? [{ ...controller, endpoints, endpointCount: endpoints.length, selected: true }]
      : [];
  });

  ungrouped.forEach((controller) => {
    const displayName = controller.customName.trim() || controller.tag;
    const tagDef = spec.tags?.find((t) => t.name === controller.tag);

    const menuGroup: MenuGroup = {
      id: `menu-${uid()}`,
      title: displayName,
      description: tagDef?.description ?? "",
      isActive: true,
    };
    menuGroups.push(menuGroup);

    const blocks: DocPage["components"] = [
      { id: uid(), type: "heading", text: displayName, level: 1 } as HeadingComponent,
      ...(tagDef?.description
        ? [{ id: uid(), type: "paragraph", text: tagDef.description } as ParagraphComponent]
        : []),
      ...buildControllerBlocks(controller, spec, schemas, false),
    ];

    pages.push({
      id: 0,
      slug: toSlug(displayName),
      title: displayName,
      description: tagDef?.description ?? "",
      menuGroupId: menuGroup.id,
      menuTitle: displayName,
      components: blocks,
    });
  });

  return { menuGroups, pages };
}
