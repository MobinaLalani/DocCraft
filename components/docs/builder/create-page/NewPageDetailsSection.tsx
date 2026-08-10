import { Field, inputClass } from "@/components/docs/builder/shared";
import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";
import {
  MenuGroupSelect,
  type QuickMenuFormProps,
} from "@/components/docs/builder/shared/MenuGroupSelect";

type NewPageDetailsSectionProps = {
  menuGroups: MenuGroup[];
  draftPage: DocPage;
  onSetNewPageTitle: (value: string) => void;
  onSetNewPageSlug: (value: string) => void;
  onSetNewPageMenuTitle: (value: string) => void;
  onSetNewPageMenuGroupId: (value: string) => void;
  onSetNewPageDescription: (value: string) => void;
  quickCreateMenu?: QuickMenuFormProps;
};

export function NewPageDetailsSection({
  menuGroups,
  draftPage,
  onSetNewPageTitle,
  onSetNewPageSlug,
  onSetNewPageMenuTitle,
  onSetNewPageMenuGroupId,
  onSetNewPageDescription,
  quickCreateMenu,
}: NewPageDetailsSectionProps) {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3">
      <div className="space-y-3">
        <div className="grid w-full gap-2 lg:grid-cols-2">
          <Field label="عنوان صفحه">
            <input
              className={`${inputClass} w-full min-w-0`}
              value={draftPage.title}
              onChange={(event) => onSetNewPageTitle(event.target.value)}
              placeholder="مثلا مدیریت کاربران"
            />
          </Field>

          <Field label="Slug">
            <input
              className={`${inputClass} w-full min-w-0`}
              value={draftPage.slug}
              onChange={(event) => onSetNewPageSlug(event.target.value)}
              placeholder="users-management"
            />
          </Field>

          <MenuGroupSelect
            menuGroups={menuGroups}
            value={draftPage.menuGroupId}
            onChange={onSetNewPageMenuGroupId}
            quickCreate={quickCreateMenu}
          />

          <Field label="عنوان در منو">
            <input
              className={`${inputClass} w-full min-w-0`}
              value={draftPage.menuTitle}
              onChange={(event) => onSetNewPageMenuTitle(event.target.value)}
              placeholder="نامی که در سایدبار نمایش داده می شود"
            />
          </Field>
        </div>

        <Field label="توضیحات صفحه">
          <textarea
            className={`${inputClass} min-h-24 w-full min-w-0 resize-y`}
            value={draftPage.description ?? ""}
            onChange={(event) => onSetNewPageDescription(event.target.value)}
            placeholder="توضیح کوتاه درباره این صفحه"
          />
        </Field>
      </div>
    </div>
  );
}
