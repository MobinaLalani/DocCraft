"use client";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";

import { PreviewSection } from "../sections/PreviewSection";

export function PreviewView() {
  const { state, actions } = useDocsBuilderContext();

  return (
    <PreviewSection
      menuGroups={state.workspace.menuGroups}
      pages={state.workspace.pages}
      activePageSlug={state.selectedPageSlug}
      onSelectPage={actions.selectPage}
      onCreatePage={() => actions.setActiveView("create-page")}
      onEditPage={() => actions.setActiveView("editor")}
      onAddBlock={actions.addBlockToActivePage}
    />
  );
}
