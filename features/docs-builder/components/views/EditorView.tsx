"use client";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";

import { PageSettingsSection } from "../sections/PageSettingsSection";
import { CanvasSection } from "../sections/CanvasSection";
import { InspectorSection } from "../sections/InspectorSection";

export function EditorView() {
  const { state, actions } = useDocsBuilderContext();

  const page = state.activePage;

  if (!page) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageSettingsSection
        activePage={page}
        menuGroups={state.workspace.menuGroups}
        onUpdatePage={actions.updateActivePage}
        onUpdatePageSlug={actions.updateActivePageSlug}
      />

      <CanvasSection
        activePage={page}
        selectedComponentId={state.selectedComponentId}
        onSelectComponent={actions.setSelectedComponentId}
        onDropAt={actions.handleDropAt}
        onDuplicateComponent={actions.duplicateComponentInActivePage}
        onRemoveComponent={actions.removeComponent}
      />

      <InspectorSection
        selectedComponent={state.selectedComponent}
        onUpdateSelectedComponent={actions.updateSelectedComponent}
      />

      <button
        type="button"
        onClick={actions.saveActivePage}
        className="
          rounded-2xl
          bg-sky-600
          px-6
          py-3
          text-white
        "
      >
        ذخیره تغییرات
      </button>
    </div>
  );
}
