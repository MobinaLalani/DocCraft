"use client";

import { useDocsBuilderContext } from "../context/DocsBuilderContext";

import { EditorView } from "./views/EditorView";
import { PreviewView } from "./views/PreviewView";
import { MenuView } from "./views/MenuView";
import { JsonView } from "./views/JsonView";
import { CreatePageView } from "./views/CreatePageView";
import { ComponentsSettingView } from "./views/ComponentsSettingView";
import { ImportSwaggerView } from "./views/importSwaggerView";

export function BuilderCenterPanel() {
  const { state } = useDocsBuilderContext();

  return (
    <div dir="rtl" className="space-y-6">
      {state.activeView === "editor" && <EditorView />}

      {state.activeView === "preview" && <PreviewView />}

      {state.activeView === "menus" && <MenuView />}

      {state.activeView === "json" && <JsonView />}

      {state.activeView === "create-page" && <CreatePageView />}

      {state.activeView === "components-setting" && <ComponentsSettingView />}

      {state.activeView === "import-swagger" && <ImportSwaggerView />}
    </div>
  );
}
