import type {
  DocPage,
  PageComponent,
  PageComponentType,
} from "@/lib/docs/schema";
import type { DocsWorkspace, MenuGroup } from "@/lib/docs/workspace";

export type BuilderView =
  | "editor"
  | "preview"
  | "menus"
  | "create-page"
  | "json"
  | "components-setting"
  | "import-swagger";

export type PageEditorScope = "active" | "create";

export type CreateMenuForm = {
  title: string;
  description: string;
  isActive: boolean;
};

export type SaveState = {
  status: "idle" | "saving" | "success" | "error";
  message: string | null;
  lastSavedPageSnapshot: string;
};

export type DocsBuilderState = {
  workspace: DocsWorkspace;
  activeView: BuilderView;
  selectedPageSlug: string;
  selectedComponentId: string | null;
  createPageDraft: DocPage;
  selectedCreateComponentId: string | null;
  createMenuForm: CreateMenuForm;
  copied: boolean;
  save: SaveState;
};

export type BuilderAction =
  | { type: "set-active-view"; view: BuilderView }
  | { type: "select-page"; slug: string }
  | { type: "select-active-component"; componentId: string | null }
  | { type: "select-create-component"; componentId: string | null }
  | { type: "set-copied"; copied: boolean }
  | { type: "set-create-menu-title"; value: string }
  | { type: "set-create-menu-description"; value: string }
  | { type: "set-create-menu-active"; value: boolean }
  | { type: "reset-create-menu-form" }
  | { type: "append-menu-group"; menu: MenuGroup }
  | { type: "replace-menu-groups"; menuGroups: MenuGroup[] }
  | {
      type: "update-menu-group";
      menuGroupId: string;
      updater: (menuGroup: MenuGroup) => MenuGroup;
    }
  | {
      type: "update-page";
      scope: PageEditorScope;
      updater: (page: DocPage) => DocPage;
    }
  | {
      type: "update-selected-component";
      scope: PageEditorScope;
      updater: (component: PageComponent) => PageComponent;
    }
  | { type: "update-active-page-slug"; value: string }
  | {
      type: "insert-block";
      scope: PageEditorScope;
      blockType: PageComponentType;
    }
  | {
      type: "move-block";
      scope: PageEditorScope;
      componentId: string;
      targetIndex: number;
    }
  | { type: "remove-block"; scope: PageEditorScope; componentId: string }
  | {
      type: "duplicate-block";
      scope: PageEditorScope;
      component: PageComponent;
    }
  | { type: "create-menu" }
  | { type: "create-page"; page?: DocPage }
  | { type: "start-save" }
  | { type: "save-success"; page: DocPage }
  | { type: "save-error"; message: string }
  | { type: "clear-save-message" };
