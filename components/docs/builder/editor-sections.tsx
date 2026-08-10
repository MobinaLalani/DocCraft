import { useState, type DragEvent } from "react";

import { BlockPicker } from "@/components/docs/builder/block-picker";
import { NewMenuSection } from "@/components/docs/builder/create-page/NewMenuSection";
import { CollapsiblePanel } from "@/components/ui/CollapsiblePanel";
import { NewPageDetailsSection } from "@/components/docs/builder/create-page/NewPageDetailsSection";
import { PageRenderer } from "@/features/docs-builder/components/renderer/PageRenderer";
import {
  componentTransferKey,
  getBlockLabel,
  getBlockMeta,
} from "@/components/docs/builder/constants";
import { Field, inputClass } from "@/components/docs/builder/shared";
import { DocsSitePreview } from "@/features/docs-preview";
import { ComponentInspectorDrawer } from "@/features/docs-builder/ui/ComponentInspectorDrawer";
import type { BuilderView } from "@/features/docs-builder/model";
import type { DocPage, PageComponent } from "@/lib/docs/schema";
import type { PageComponentType } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";

type PageSettingsSectionProps = {
  activePage: DocPage;
  menuGroups: MenuGroup[];
  onUpdatePage: (updater: (page: DocPage) => DocPage) => void;
  onUpdatePageSlug: (value: string) => void;
};

export function PageSettingsSection({
  activePage,
  menuGroups,
  onUpdatePage,
  onUpdatePageSlug,
}: PageSettingsSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">تعریف صفحه</p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            تنظیمات صفحه فعال
          </h3>
        </div>
        <p className="text-sm text-slate-600">
          در این بخش عنوان، مسیر و منوی صفحه را مشخص کن.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="عنوان صفحه">
          <input
            className={inputClass}
            value={activePage.title}
            onChange={(event) =>
              onUpdatePage((page) => ({ ...page, title: event.target.value }))
            }
          />
        </Field>

        <Field label="Slug">
          
          
          <input
            className={inputClass}
            value={activePage.slug}
            onChange={(event) => onUpdatePageSlug(event.target.value)}
          />
        </Field>

        <Field label="گروه منو">
          <select
            className={inputClass}
            value={activePage.menuGroupId}
            onChange={(event) =>
              onUpdatePage((page) => ({
                ...page,
                menuGroupId: event.target.value,
              }))
            }
          >
            {menuGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="عنوان در منو">
          <input
            className={inputClass}
            value={activePage.menuTitle}
            onChange={(event) =>
              onUpdatePage((page) => ({
                ...page,
                menuTitle: event.target.value,
              }))
            }
          />
        </Field>
      </div>

      <Field label="توضیحات صفحه" className="mt-4">
        <textarea
          className={`${inputClass} min-h-28`}
          value={activePage.description ?? ""}
          onChange={(event) =>
            onUpdatePage((page) => ({
              ...page,
              description: event.target.value,
            }))
          }
        />
      </Field>
    </section>
  );
}

type CanvasSectionProps = {
  activePage: DocPage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string) => void;
  onDropAt: (event: DragEvent<HTMLDivElement>, targetIndex: number) => void;
  onDuplicateComponent: (component: PageComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onEditComponent?: (componentId: string) => void;
  title?: string;
  description?: string;
  showDropHint?: boolean;
};

export function CanvasSection({
  activePage,
  selectedComponentId,
  onSelectComponent,
  onDropAt,
  onDuplicateComponent,
  onRemoveComponent,
  onEditComponent,
  title = "چیدمان کامپوننت ها",
  description = "از سایدبار بلوک ها را بکش یا بلوک های فعلی را جابه جا کن.",
  showDropHint = true,
}: CanvasSectionProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">بوم صفحه</p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="text-sm text-slate-600">{description}</p>
          <button
            type="button"
            onClick={() => setIsPreviewVisible((current) => !current)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              isPreviewVisible
                ? "bg-slate-950 text-white hover:bg-slate-800"
                : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {isPreviewVisible ? "بستن پیش نمایش" : "نمایش پیش نمایش"}
          </button>
        </div>
      </div>

      {isPreviewVisible ? (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">خروجی صفحه</p>
              <p className="mt-1 text-sm text-slate-600">
                پیش نمایش زنده همین صفحه بر اساس چیدمان فعلی
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              /pages/{activePage.slug}
            </span>
          </div>
          <PageRenderer page={activePage} />
        </div>
      ) : null}

      <div className="space-y-3">
        {activePage.components.map((component, index) => (
          <div key={component.id} className="space-y-3">
            <div
              className="h-3 rounded-full border border-dashed border-slate-200 bg-slate-50"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onDropAt(event, index)}
            />

            <div
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData(componentTransferKey, component.id)
              }
              onClick={() => onSelectComponent(component.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectComponent(component.id);
                }
              }}
              className={`rounded-3xl border p-5 text-right shadow-sm transition ${
                selectedComponentId === component.id
                  ? "border-sky-500 bg-sky-50 text-slate-950 ring-4 ring-sky-100"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedComponentId === component.id
                          ? "bg-sky-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {component.type}
                    </span>
                    <span
                      className={`text-xs ${
                        selectedComponentId === component.id
                          ? "text-sky-700"
                          : "text-slate-500"
                      }`}
                    >
                      {getBlockMeta(component)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold tracking-tight">
                    {getBlockLabel(component)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      (onEditComponent ?? onSelectComponent)(component.id);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      selectedComponentId === component.id
                        ? "bg-sky-600 text-white"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDuplicateComponent(component);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      selectedComponentId === component.id
                        ? "bg-white text-slate-700 shadow-sm"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    کپی
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveComponent(component.id);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      selectedComponentId === component.id
                        ? "bg-white text-rose-600 shadow-sm"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {showDropHint ? (
          <div
            className="flex min-h-20 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDropAt(event, activePage.components.length)}
          >
            بلوک جدید را اینجا رها کن
          </div>
        ) : null}
      </div>
    </section>
  );
}

type CreatePageViewProps = {
  menuGroups: MenuGroup[];
  pages: DocPage[];
  draftPage: DocPage;
  selectedComponentId: string | null;
  selectedComponent: PageComponent | null;
  createMenuTitle: string;
  createMenuDescription: string;
  createMenuIsActive: boolean;
  onSetNewMenuTitle: (value: string) => void;
  onSetNewMenuDescription: (value: string) => void;
  onSetNewMenuActive: (value: boolean) => void;
  onSetNewPageTitle: (value: string) => void;
  onSetNewPageSlug: (value: string) => void;
  onSetNewPageMenuTitle: (value: string) => void;
  onSetNewPageMenuGroupId: (value: string) => void;
  onSetNewPageDescription: (value: string) => void;
  onCreateMenu: () => void | Promise<void>;
  onSaveMenuGroupChanges: (
    menuGroupId: string,
    input: {
      title: string;
      description: string;
      isActive: boolean;
    },
  ) => Promise<void>;
  onDeleteMenuGroup: (menuGroupId: string) => Promise<void>;
  onResetMenuForm: () => void;
  onCreatePage: () => void;
  onBackToEditor: () => void;
  onAddBlock: (type: PageComponentType) => void;
  onDropAt: (event: DragEvent<HTMLDivElement>, targetIndex: number) => void;
  onSelectComponent: (componentId: string | null) => void;
  onDuplicateComponent: (component: PageComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
};

export function CreatePageView({
  menuGroups,
  pages,
  draftPage,
  selectedComponentId,
  selectedComponent,
  createMenuTitle,
  createMenuDescription,
  createMenuIsActive,
  onSetNewMenuTitle,
  onSetNewMenuDescription,
  onSetNewMenuActive,
  onSetNewPageTitle,
  onSetNewPageSlug,
  onSetNewPageMenuTitle,
  onSetNewPageMenuGroupId,
  onSetNewPageDescription,
  onCreateMenu,
  onSaveMenuGroupChanges,
  onDeleteMenuGroup,
  onResetMenuForm,
  onCreatePage,
  onBackToEditor,
  onAddBlock,
  onDropAt,
  onSelectComponent,
  onDuplicateComponent,
  onRemoveComponent,
  onUpdateSelectedComponent,
}: CreatePageViewProps) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const openInspector = (componentId: string) => {
    onSelectComponent(componentId);
    setIsInspectorOpen(true);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>

          <h3 className="text-3xl font-semibold tracking-tight text-slate-950">
            ایجاد صفحه جدید
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            از این بخش یک صفحه جدید بساز، جای آن را در منو مشخص کن و در صورت
            نیاز همانجا یک منوی جدید هم تعریف کن.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToEditor}
          className="rounded-full border border-slate-300 bg-black px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400 hover:bg-(--darkBlue)"
        >
          بازگشت به ویرایش صفحه
        </button>
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-7">
          <div className="space-y-4">
            {/* <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm font-medium text-slate-500">مدیریت محتوا</p>
              <h4 className="mt-1 text-xl font-semibold text-slate-950">
                تعریف صفحه و منو
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                مشخصات صفحه جدید و تعریف منوی جدید به‌صورت بخش‌های جدا و
                بازشونده نمایش داده می‌شوند.
              </p>
            </div> */}

            <CollapsiblePanel
              subtitle="تعریف صفحه"
              title="مشخصات صفحه جدید"
              defaultOpen={false}
            >
              <NewPageDetailsSection
                menuGroups={menuGroups}
                draftPage={draftPage}
                onSetNewPageTitle={onSetNewPageTitle}
                onSetNewPageSlug={onSetNewPageSlug}
                onSetNewPageMenuTitle={onSetNewPageMenuTitle}
                onSetNewPageMenuGroupId={onSetNewPageMenuGroupId}
                onSetNewPageDescription={onSetNewPageDescription}
              />
            </CollapsiblePanel>

            <CollapsiblePanel
              subtitle="در صورت نیاز"
              title="تعریف منوی جدید"
              defaultOpen={false}
            >
              <NewMenuSection
                menuGroups={menuGroups}
                pages={pages}
                createMenuTitle={createMenuTitle}
                createMenuDescription={createMenuDescription}
                createMenuIsActive={createMenuIsActive}
                onSetNewMenuTitle={onSetNewMenuTitle}
                onSetNewMenuDescription={onSetNewMenuDescription}
                onSetNewMenuActive={onSetNewMenuActive}
                onCreateMenu={onCreateMenu}
                onSaveMenuGroupChanges={onSaveMenuGroupChanges}
                onDeleteMenuGroup={onDeleteMenuGroup}
                onResetMenuForm={onResetMenuForm}
              />
            </CollapsiblePanel>
          </div>
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-[350px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">
                  کامپوننت ها
                </p>
                <h4 className="text-xl font-semibold text-slate-950">
                  بلوک های قابل استفاده در صفحه
                </h4>
                <p className="text-sm leading-6 text-slate-600">
                  بلوک ها را بکش و داخل بوم صفحه رها کن یا با کلیک مستقیم اضافه
                  کن.
                </p>
              </div>

              <div className="mt-4">
                <BlockPicker
                  onAddBlock={onAddBlock}
                  columnsClassName="grid-cols-3"
                />
              </div>
            </div>

          </div>

          <div className="min-w-0">
            <CanvasSection
              activePage={draftPage}
              selectedComponentId={selectedComponentId}
              onSelectComponent={(componentId) => onSelectComponent(componentId)}
              onDropAt={onDropAt}
              onDuplicateComponent={onDuplicateComponent}
              onRemoveComponent={onRemoveComponent}
              onEditComponent={openInspector}
              description="برای تغییر محتوا و تنظیمات، روی دکمه ویرایش کامپوننت بزن."
            />
          </div>
        </div>

        <ComponentInspectorDrawer
          isOpen={isInspectorOpen}
          selectedComponent={selectedComponent}
          onClose={() => setIsInspectorOpen(false)}
          onUpdateSelectedComponent={onUpdateSelectedComponent}
        />

        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 rounded-3xl bg-emerald-50 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                ثبت صفحه جدید
              </p>
              <p className="mt-1 text-sm text-emerald-900/80">
                با این دکمه، JSON کامل همین صفحه جدید برای ثبت نهایی آماده
                می‌شود و در لاگ هم نمایش داده خواهد شد.
              </p>
            </div>
            <button
              type="button"
              onClick={onCreatePage}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              ذخیره صفحه جدید
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

type MenuManagementViewProps = {
  menuGroups: MenuGroup[];
  pages: DocPage[];
  createMenuTitle: string;
  createMenuDescription: string;
  createMenuIsActive: boolean;
  onSetNewMenuTitle: (value: string) => void;
  onSetNewMenuDescription: (value: string) => void;
  onSetNewMenuActive: (value: boolean) => void;
  onCreateMenu: () => void | Promise<void>;
  onSaveMenuGroupChanges: (
    menuGroupId: string,
    input: {
      title: string;
      description: string;
      isActive: boolean;
    },
  ) => Promise<void>;
  onDeleteMenuGroup: (menuGroupId: string) => Promise<void>;
  onResetMenuForm: () => void;
};

function MenuManagementView({
  menuGroups,
  pages,
  createMenuTitle,
  createMenuDescription,
  createMenuIsActive,
  onSetNewMenuTitle,
  onSetNewMenuDescription,
  onSetNewMenuActive,
  onCreateMenu,
  onSaveMenuGroupChanges,
  onDeleteMenuGroup,
  onResetMenuForm,
}: MenuManagementViewProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium text-slate-500">مدیریت منوها</p>
        <h3 className="text-3xl font-semibold tracking-tight text-slate-950">
          تعریف و ویرایش منوها
        </h3>
        <p className="text-sm leading-7 text-slate-600">
          از این بخش می‌توانی منوی جدید بسازی، وضعیت نمایش آن را فعال یا غیرفعال
          کنی و منوهای قبلی را هم ویرایش و ذخیره کنی.
        </p>
      </div>

      <NewMenuSection
        menuGroups={menuGroups}
        pages={pages}
        createMenuTitle={createMenuTitle}
        createMenuDescription={createMenuDescription}
        createMenuIsActive={createMenuIsActive}
        onSetNewMenuTitle={onSetNewMenuTitle}
        onSetNewMenuDescription={onSetNewMenuDescription}
        onSetNewMenuActive={onSetNewMenuActive}
        onCreateMenu={onCreateMenu}
        onSaveMenuGroupChanges={onSaveMenuGroupChanges}
        onDeleteMenuGroup={onDeleteMenuGroup}
        onResetMenuForm={onResetMenuForm}
      />
    </section>
  );
}

type PreviewSectionProps = {
  menuGroups: MenuGroup[];
  pages: DocPage[];
  activePageSlug: string;
  onSelectPage: (slug: string) => void;
  onCreatePage: () => void;
  onEditPage: () => void;
  onAddBlock: (type: PageComponentType) => void;
};

export function PreviewSection({
  menuGroups,
  pages,
  activePageSlug,
  onSelectPage,
  onCreatePage,
  onEditPage,
  onAddBlock,
}: PreviewSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <section className="space-y-4">
      <div className="rounded-3xl bg-white p-4">
        <div className="flex justify-end gap-2">
  
          <button
            type="button"
            onClick={onEditPage}
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm  font-bold text-white transition hover:bg-slate-800"
          >
            ویرایش صفحه
          </button>
        </div>

        {isPickerOpen ? (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <BlockPicker
              onAddBlock={(type) => {
                onAddBlock(type);
                setIsPickerOpen(false);
                onEditPage();
              }}
            />
          </div>
        ) : null}
      </div>
      <DocsSitePreview
        menuGroups={menuGroups}
        pages={pages}
        activePageSlug={activePageSlug}
        interactive
        onSelectPage={onSelectPage}
        onCreatePage={onCreatePage}
        showSidebar={false}
        contained={false}
      />
    </section>
  );
}

type EditorWorkspaceProps = {
  activePage: DocPage;
  menuGroups: MenuGroup[];
  selectedComponentId: string | null;
  selectedComponent: PageComponent | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  onUpdatePage: (updater: (page: DocPage) => DocPage) => void;
  onUpdatePageSlug: (value: string) => void;
  onSelectComponent: (componentId: string | null) => void;
  onDropAt: (event: DragEvent<HTMLDivElement>, targetIndex: number) => void;
  onDuplicateComponent: (component: PageComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onAddBlock: (type: PageComponentType) => void;
  onSavePage: () => void;
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
};

function EditorWorkspace({
  activePage,
  menuGroups,
  selectedComponentId,
  selectedComponent,
  hasUnsavedChanges,
  isSaving,
  saveMessage,
  onUpdatePage,
  onUpdatePageSlug,
  onSelectComponent,
  onDropAt,
  onDuplicateComponent,
  onRemoveComponent,
  onAddBlock,
  onSavePage,
  onUpdateSelectedComponent,
}: EditorWorkspaceProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const openInspector = (componentId: string) => {
    onSelectComponent(componentId);
    setIsInspectorOpen(true);
  };

  return (
    <>
      <PageSettingsSection
        activePage={activePage}
        menuGroups={menuGroups}
        onUpdatePage={onUpdatePage}
        onUpdatePageSlug={onUpdatePageSlug}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">اکشن های صفحه</p>
            <h3 className="text-xl font-semibold text-slate-950">
              افزودن و ویرایش کامپوننت ها
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsPickerOpen((current) => !current)}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            افزودن کامپوننت
          </button>
        </div>

        {isPickerOpen ? (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <BlockPicker
              onAddBlock={(type) => {
                onAddBlock(type);
                setIsPickerOpen(false);
              }}
            />
          </div>
        ) : null}
      </section>

      <div>
        <CanvasSection
          activePage={activePage}
          selectedComponentId={selectedComponentId}
          onSelectComponent={(componentId) => onSelectComponent(componentId)}
          onDropAt={onDropAt}
          onDuplicateComponent={onDuplicateComponent}
          onRemoveComponent={onRemoveComponent}
          onEditComponent={openInspector}
          title="کامپوننت‌های این صفحه"
          description="برای تغییر محتوا و تنظیمات، روی دکمه ویرایش کامپوننت بزن."
        />
      </div>

      <ComponentInspectorDrawer
        isOpen={isInspectorOpen}
        selectedComponent={selectedComponent}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onClose={() => setIsInspectorOpen(false)}
        onSave={onSavePage}
        onUpdateSelectedComponent={onUpdateSelectedComponent}
      />

      <div className="border-t border-slate-200 pt-6">
        <div className="flex flex-col gap-3 rounded-3xl bg-sky-50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">
              ذخیره تغییرات صفحه
            </p>
            <p className="mt-1 text-sm text-sky-900/80">
              بعد از ویرایش کامپوننت ها و تنظیمات صفحه، با این دکمه فایل JSON
              همین صفحه بازنویسی می‌شود.
            </p>
            {saveMessage ? (
              <p className="mt-2 text-sm text-sky-700">{saveMessage}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onSavePage}
            disabled={!hasUnsavedChanges || isSaving}
            className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات صفحه"}
          </button>
        </div>
      </div>
    </>
  );
}

type JsonSectionProps = {
  copied: boolean;
  jsonOutput: string;
  onCopy: () => void;
};

export function JsonSection({ copied, jsonOutput, onCopy }: JsonSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">JSON کل ساختار</p>
          <p className="text-sm text-slate-600">شامل منوها و همه صفحه ها</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {copied ? "کپی شد" : "کپی JSON"}
        </button>
      </div>
      <pre className="max-h-[680px] overflow-auto rounded-3xl bg-slate-950 p-5 text-xs leading-6 text-slate-100 shadow-sm">
        <code>{jsonOutput}</code>
      </pre>
    </section>
  );
}

type BuilderCenterPanelProps = {
  activeView: BuilderView;
  activePage: DocPage;
  menuGroups: MenuGroup[];
  pages: DocPage[];
  selectedComponentId: string | null;
  selectedComponent: PageComponent | null;
  copied: boolean;
  jsonOutput: string;
  onUpdatePage: (updater: (page: DocPage) => DocPage) => void;
  onUpdatePageSlug: (value: string) => void;
  onSelectComponent: (componentId: string | null) => void;
  onDropAt: (event: DragEvent<HTMLDivElement>, targetIndex: number) => void;
  onDuplicateComponent: (component: PageComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
  onSetNewMenuTitle: (value: string) => void;
  onSetNewMenuDescription: (value: string) => void;
  onSetNewPageTitle: (value: string) => void;
  onSetNewPageSlug: (value: string) => void;
  onSetNewPageMenuTitle: (value: string) => void;
  onSetNewPageMenuGroupId: (value: string) => void;
  onCreateMenu: () => void;
  onCreatePage: () => void;
  onBackToEditor: () => void;
  onSelectPage: (slug: string) => void;
  onOpenCreatePage: () => void;
  onCopyJson: () => void;
  onOpenEditPage: () => void;
  onAddBlockToActivePage: (type: PageComponentType) => void;
  createMenuTitle: string;
  createMenuDescription: string;
  createPageDraft: DocPage;
  selectedCreateComponentId: string | null;
  selectedCreateComponent: PageComponent | null;
  onSetNewPageDescription: (value: string) => void;
  onCreatePageDropAt: (
    event: DragEvent<HTMLDivElement>,
    targetIndex: number,
  ) => void;
  onAddBlockToNewPage: (type: PageComponentType) => void;
  onSelectCreateComponent: (componentId: string | null) => void;
  onDuplicateCreateComponent: (component: PageComponent) => void;
  onRemoveCreateComponent: (componentId: string) => void;
  onUpdateSelectedCreateComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
  hasUnsavedPageChanges: boolean;
  isSavingPage: boolean;
  saveMessage: string | null;
  onSaveActivePage: () => void;
  createMenuIsActive: boolean;
  onSetNewMenuActive: (value: boolean) => void;
  onSaveMenuGroupChanges: (
    menuGroupId: string,
    input: {
      title: string;
      description: string;
      isActive: boolean;
    },
  ) => Promise<void>;
  onDeleteMenuGroup: (menuGroupId: string) => Promise<void>;
  onResetMenuForm: () => void;
};

export function BuilderCenterPanel(props: BuilderCenterPanelProps) {
  return (
    <div dir="rtl" className="space-y-6">
      {props.activeView === "create-page" ? (
        <CreatePageView
          menuGroups={props.menuGroups}
          pages={props.pages}
          draftPage={props.createPageDraft}
          selectedComponentId={props.selectedCreateComponentId}
          selectedComponent={props.selectedCreateComponent}
          createMenuTitle={props.createMenuTitle}
          createMenuDescription={props.createMenuDescription}
          createMenuIsActive={props.createMenuIsActive}
          onSetNewMenuTitle={props.onSetNewMenuTitle}
          onSetNewMenuDescription={props.onSetNewMenuDescription}
          onSetNewMenuActive={props.onSetNewMenuActive}
          onSetNewPageTitle={props.onSetNewPageTitle}
          onSetNewPageSlug={props.onSetNewPageSlug}
          onSetNewPageMenuTitle={props.onSetNewPageMenuTitle}
          onSetNewPageMenuGroupId={props.onSetNewPageMenuGroupId}
          onSetNewPageDescription={props.onSetNewPageDescription}
          onCreateMenu={props.onCreateMenu}
          onSaveMenuGroupChanges={props.onSaveMenuGroupChanges}
          onDeleteMenuGroup={props.onDeleteMenuGroup}
          onResetMenuForm={props.onResetMenuForm}
          onCreatePage={props.onCreatePage}
          onBackToEditor={props.onBackToEditor}
          onAddBlock={props.onAddBlockToNewPage}
          onDropAt={props.onCreatePageDropAt}
          onSelectComponent={props.onSelectCreateComponent}
          onDuplicateComponent={props.onDuplicateCreateComponent}
          onRemoveComponent={props.onRemoveCreateComponent}
          onUpdateSelectedComponent={props.onUpdateSelectedCreateComponent}
        />
      ) : null}

      {props.activeView === "menus" ? (
        <MenuManagementView
          menuGroups={props.menuGroups}
          pages={props.pages}
          createMenuTitle={props.createMenuTitle}
          createMenuDescription={props.createMenuDescription}
          createMenuIsActive={props.createMenuIsActive}
          onSetNewMenuTitle={props.onSetNewMenuTitle}
          onSetNewMenuDescription={props.onSetNewMenuDescription}
          onSetNewMenuActive={props.onSetNewMenuActive}
          onCreateMenu={props.onCreateMenu}
          onSaveMenuGroupChanges={props.onSaveMenuGroupChanges}
          onDeleteMenuGroup={props.onDeleteMenuGroup}
          onResetMenuForm={props.onResetMenuForm}
        />
      ) : null}

      {props.activeView === "editor" ? (
        <EditorWorkspace
          activePage={props.activePage}
          menuGroups={props.menuGroups}
          selectedComponentId={props.selectedComponentId}
          selectedComponent={props.selectedComponent}
          hasUnsavedChanges={props.hasUnsavedPageChanges}
          isSaving={props.isSavingPage}
          saveMessage={props.saveMessage}
          onUpdatePage={props.onUpdatePage}
          onUpdatePageSlug={props.onUpdatePageSlug}
          onSelectComponent={props.onSelectComponent}
          onDropAt={props.onDropAt}
          onDuplicateComponent={props.onDuplicateComponent}
          onRemoveComponent={props.onRemoveComponent}
          onAddBlock={props.onAddBlockToActivePage}
          onSavePage={props.onSaveActivePage}
          onUpdateSelectedComponent={props.onUpdateSelectedComponent}
        />
      ) : null}

      {props.activeView === "preview" ? (
        <PreviewSection
          menuGroups={props.menuGroups}
          pages={props.pages}
          activePageSlug={props.activePage.slug}
          onSelectPage={props.onSelectPage}
          onCreatePage={props.onOpenCreatePage}
          onEditPage={props.onOpenEditPage}
          onAddBlock={props.onAddBlockToActivePage}
        />
      ) : null}

      {props.activeView === "json" ? (
        <JsonSection
          copied={props.copied}
          jsonOutput={props.jsonOutput}
          onCopy={props.onCopyJson}
        />
      ) : null}
    </div>
  );
}
