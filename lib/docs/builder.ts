import type {
  ApiFieldKind,
  CodeLanguage,
  DocPage,
  HttpMethod,
  PageComponent,
  PageComponentType,
} from "@/lib/docs/schema";

export type PaletteBlock = {
  type: PageComponentType;
  label: string;
  description: string;
};

export const paletteBlocks: PaletteBlock[] = [
  {
    type: "heading",
    label: "Heading",
    description: "Section titles for endpoint groups and response areas.",
  },
  {
    type: "note",
    label: "Note",
    description: "Highlighted notes, warnings, tips, and important reminders.",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Human-readable descriptions, notes, and instructions.",
  },
  {
    type: "endpoint",
    label: "Endpoint",
    description: "Method, route, auth, and content-type summary block.",
  },
  {
    type: "field-group",
    label: "Field Group",
    description:
      "Headers, query params, path params, request body, or response fields.",
  },
  {
    type: "table",
    label: "Table",
    description: "Examples, status codes, and tabular response sections.",
  },
  {
    type: "code",
    label: "Code Example",
    description: "Request samples, response payloads, and SDK snippets.",
  },
  {
    type: "image",
    label: "Image Upload",
    description: "Upload an image and add alternative text or a caption.",
  },

];

function buildId(type: PageComponentType) {
  return `${type}-${Math.random().toString(36).slice(2, 10)}`;
}

function createFields(kind: ApiFieldKind) {
  if (kind === "query") {
    return [
      {
        id: buildId("field-group"),
        name: "page",
        type: "number",
        required: false,
        description: "Current page number.",
      },
      {
        id: buildId("field-group"),
        name: "search",
        type: "string",
        required: false,
        description: "Filter users by search text.",
      },
    ];
  }

  return [
    {
      id: buildId("field-group"),
      name: "Authorization",
      type: "Bearer token",
      required: true,
      description: "Access token for authenticated requests.",
    },
  ];
}

export function createComponent(type: PageComponentType): PageComponent {
  if (type === "heading") {
    return {
      id: buildId(type),
      type,
      text: "New Section",
      level: 2,
    };
  }

  if (type === "note") {
    return {
      id: buildId(type),
      type,
      title: "نکته مهم",
      text: "اینجا می‌توانی یک توضیح مهم، هشدار یا راهنمای کوتاه بنویسی.",
      tone: "info",
    };
  }

  if (type === "paragraph") {
    return {
      id: buildId(type),
      type,
      text: "Write a short explanation for this API section.",
    };
  }

  if (type === "endpoint") {
    return {
      id: buildId(type),
      type,
      title: "Get Users",
      method: "GET",
      path: "/api/users",
      summary: "Returns a paginated list of users.",
      auth: "Bearer token",
      requestContentType: "application/json",
      responseContentType: "application/json",
      requestExample: '{\n  "name": "Sara Ahmadi",\n  "email": "sara@example.com",\n  "active": true\n}',
      responseExample: '{\n  "id": 42,\n  "name": "Sara Ahmadi",\n  "email": "sara@example.com",\n  "active": true\n}',
      responseStatus: 200,
    };
  }

  if (type === "field-group") {
    return {
      id: buildId(type),
      type,
      title: "Query Parameters",
      kind: "query",
      fields: createFields("query"),
    };
  }

  if (type === "table") {
    return {
      id: buildId(type),
      type,
      title: "Status Codes",
      columns: [
        { title: "Code", field: "code" },
        { title: "Meaning", field: "meaning" },
      ],
      rows: [
        { code: 200, meaning: "Request completed successfully." },
        { code: 401, meaning: "Authentication failed." },
      ],
      emptyMessage: "No rows configured yet.",
    };
  }

  if (type === "image") {
    return {
      id: buildId(type),
      type,
      src: "",
      alt: "",
      caption: "",
      style: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
      },
    };
  }

  return {
    id: buildId(type),
    type: "code",
    title: "Response Example",
    language: "json",
    code: '{\n  "success": true\n}',
  };
}

export function duplicateComponent(component: PageComponent): PageComponent {
  return {
    ...component,
    id: buildId(component.type),
  } as PageComponent;
}

export const methodOptions: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export const codeLanguageOptions: CodeLanguage[] = [ 
  "json",
  "bash",
  "javascript",
  "typescript",
];

export const fieldGroupKinds: ApiFieldKind[] = [
  
  "headers",
  "query",
  "path",
  "body",
  "response",
];

export function moveComponent(
  page: DocPage,
  componentId: string,
  targetIndex: number,
): DocPage {
  const currentIndex = page.components.findIndex(
    (component) => component.id === componentId,
  );

  if (currentIndex === -1 || currentIndex === targetIndex) {
    return page;
  }

  const nextComponents = [...page.components];
  const [component] = nextComponents.splice(currentIndex, 1);
  const normalizedIndex =
    currentIndex < targetIndex ? targetIndex - 1 : targetIndex;
  nextComponents.splice(normalizedIndex, 0, component);

  return {
    ...page,
    components: nextComponents,
  };
}

export function insertComponent(
  page: DocPage,
  type: PageComponentType,
  targetIndex: number,
): { page: DocPage; componentId: string } {
  const component = createComponent(type);
  const nextComponents = [...page.components];
  nextComponents.splice(targetIndex, 0, component);

  return {
    page: {
      ...page,
      components: nextComponents,
    },
    componentId: component.id,
  };
}
