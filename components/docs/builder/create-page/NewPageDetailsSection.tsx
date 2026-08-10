import { Field, inputClass } from "@/components/docs/builder/shared";
import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";
import { Plus } from "lucide-react";

type NewPageDetailsSectionProps = {
  menuGroups: MenuGroup[];
  draftPage: DocPage;
  onSetNewPageTitle: (value: string) => void;
  onSetNewPageSlug: (value: string) => void;
  onSetNewPageMenuTitle: (value: string) => void;
  onSetNewPageMenuGroupId: (value: string) => void;
  onSetNewPageDescription: (value: string) => void;
  onAddMenuClick?: () => void;
};

export function NewPageDetailsSection({
  menuGroups,
  draftPage,
  onSetNewPageTitle,
  onSetNewPageSlug,
  onSetNewPageMenuTitle,
  onSetNewPageMenuGroupId,
  onSetNewPageDescription,
  onAddMenuClick,
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

          <div className="space-y-2">
            <span className="block text-sm font-medium text-slate-700">گروه منو</span>
            <div className="flex w-full items-stretch gap-2">
              <select
                className={`${inputClass} min-w-0 flex-1 !rounded-xl`}
                value={draftPage.menuGroupId}
                onChange={(event) => onSetNewPageMenuGroupId(event.target.value)}
              >
                {menuGroups.length === 0 ? (
                  <option value="">هنوز منویی تعریف نشده است</option>
                ) : null}
                {menuGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.title}
                    {group.isActive ? "" : " (غیرفعال)"}
                  </option>
                ))}
              </select>
              {onAddMenuClick ? (
                <button
                  type="button"
                  onClick={onAddMenuClick}
                  className="inline-flex aspect-square shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  aria-label="افزودن منوی جدید"
                  title="افزودن منوی جدید"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

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
