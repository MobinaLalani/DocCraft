"use client";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";
import { BuilderToolsColumn } from "@/components/docs/builder/shared/BuilderToolsColumn";

import { PageSettingsSection } from "../sections/PageSettingsSection";
import { CanvasSection } from "../sections/CanvasSection";

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
        quickCreateMenu={{
          title: state.createMenuForm.title,
          description: state.createMenuForm.description,
          isActive: state.createMenuForm.isActive,
          onTitleChange: actions.setNewMenuTitle,
          onDescriptionChange: actions.setNewMenuDescription,
          onActiveChange: actions.setNewMenuActive,
          onCreate: actions.handleCreateMenu,
          onReset: actions.resetMenuForm,
        }}
      />

      <div className="flex flex-col gap-6 xl:flex-row">
        <BuilderToolsColumn
          selectedComponent={state.selectedComponent}
          onAddBlock={actions.addBlockToActivePage}
          onUpdateSelectedComponent={actions.updateSelectedComponent}
        />
        <div className="min-w-0 flex-1">
          <CanvasSection
            activePage={page}
            selectedComponentId={state.selectedComponentId}
            onSelectComponent={actions.setSelectedComponentId}
            onDropAt={actions.handleDropAt}
            onDuplicateComponent={actions.duplicateComponentInActivePage}
            onRemoveComponent={actions.removeComponent}
          />
        </div>
      </div>

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
