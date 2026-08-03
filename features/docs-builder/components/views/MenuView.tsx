"use client";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";

import { MenuManagementSection } from "../sections/MenuManagementSection";

export function MenuView() {
  const { state, actions } = useDocsBuilderContext();

  return (
    <MenuManagementSection
      menuGroups={state.workspace.menuGroups}
      pages={state.workspace.pages}
      createMenuTitle={state.createMenuForm.title}
      createMenuDescription={state.createMenuForm.description}
      createMenuIsActive={state.createMenuForm.isActive}
      onSetNewMenuTitle={actions.setNewMenuTitle}
      onSetNewMenuDescription={actions.setNewMenuDescription}
      onSetNewMenuActive={actions.setNewMenuActive}
      onCreateMenu={actions.handleCreateMenu}
      onSaveMenuGroupChanges={actions.saveMenuGroupChanges}
      onDeleteMenuGroup={actions.deleteMenuGroup}
      onResetMenuForm={actions.resetMenuForm}
    />
  );
}
