"use client";

import { useState } from "react";

import { BlockPicker } from "@/components/docs/builder/block-picker";
import { InspectorPanel } from "@/components/docs/builder/inspector-panel";
import { NewPageDetailsSection } from "@/components/docs/builder/create-page/NewPageDetailsSection";
import { QuickCreateMenuModal } from "@/components/docs/builder/create-page/QuickCreateMenuModal";

import { CanvasSection } from "../sections/CanvasSection";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";

import { useDocsBuilderContext } from "@/features/docs-builder/context/DocsBuilderContext";

export function CreatePageView() {
  const { state, actions } = useDocsBuilderContext();
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const closeMenuModal = () => {
    actions.resetMenuForm();
    setIsMenuModalOpen(false);
  };

  return (
    <section
      className="
      rounded-3xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
    "
    >
      <div
        className="
        mb-6
        flex
        justify-between
        items-end
      "
      >
        <div>
          <h3
            className="
            text-3xl
            font-semibold
          "
          >
            ایجاد صفحه جدید
          </h3>

          <p
            className="
            mt-2
            text-sm
            text-slate-600
          "
          >
            تعریف صفحه جدید، منو و کامپوننت‌های آن
          </p>
        </div>

        <button
          type="button"
          onClick={() => actions.setActiveView("editor")}
          className="
            rounded-2xl
            bg-black
            px-5
            py-3
            text-white
          "
        >
          بازگشت به ویرایش
        </button>
      </div>

      <div className="space-y-6">
        {/* اطلاعات صفحه */}

        <CollapsiblePanel
          subtitle="تعریف صفحه"
          title="مشخصات صفحه جدید"
          defaultOpen={false}
        >
          <NewPageDetailsSection
            menuGroups={state.workspace.menuGroups}
            draftPage={state.createPageDraft}
            onSetNewPageTitle={actions.setNewPageTitle}
            onSetNewPageSlug={actions.setNewPageSlug}
            onSetNewPageMenuTitle={actions.setNewPageMenuTitle}
            onSetNewPageMenuGroupId={actions.setNewPageMenuGroupId}
            onSetNewPageDescription={actions.setNewPageDescription}
            onAddMenuClick={() => setIsMenuModalOpen(true)}
          />
        </CollapsiblePanel>

        {/* Editor */}

        <div
          className="
          flex
          gap-6
        "
        >
          {/* ابزارها */}

          <div
            className="
            w-80
            space-y-6
          "
          >
            <section
              className="
              rounded-3xl
              border
              bg-white
              p-5
            "
            >
              <h4
                className="
                text-xl
                font-semibold
              "
              >
                کامپوننت‌ها
              </h4>

              <BlockPicker onAddBlock={actions.addBlockToNewPage} />
            </section>

            <section
              className="
              rounded-3xl
              border
              bg-white
              p-5
            "
            >
              <h4
                className="
                text-xl
                font-semibold
              "
              >
                ویرایش کامپوننت
              </h4>

              <InspectorPanel
                selectedComponent={state.selectedCreateComponent}
                onUpdateSelectedComponent={
                  actions.updateSelectedCreateComponent
                }
              />
            </section>
          </div>

          {/* Canvas */}

          <div
            className="
            flex-1
          "
          >
            <CanvasSection
              activePage={state.createPageDraft}
              selectedComponentId={state.selectedCreateComponentId}
              onSelectComponent={actions.setSelectedCreateComponentId}
              onDropAt={actions.handleCreatePageDropAt}
              onDuplicateComponent={actions.duplicateDraftComponent}
              onRemoveComponent={actions.removeDraftComponent}
            />
          </div>
        </div>

        {/* Save */}

        <div
          className="
          border-t
          pt-6
        "
        >
          <button
            type="button"
            onClick={actions.handleCreatePage}
            className="
              rounded-2xl
              bg-emerald-600
              px-6
              py-3
              text-white
            "
          >
            ذخیره صفحه جدید
          </button>
        </div>
      </div>

      {isMenuModalOpen ? (
        <QuickCreateMenuModal
          title={state.createMenuForm.title}
          description={state.createMenuForm.description}
          isActive={state.createMenuForm.isActive}
          onTitleChange={actions.setNewMenuTitle}
          onDescriptionChange={actions.setNewMenuDescription}
          onActiveChange={actions.setNewMenuActive}
          onCreate={actions.handleCreateMenu}
          onClose={closeMenuModal}
        />
      ) : null}
    </section>
  );
}
