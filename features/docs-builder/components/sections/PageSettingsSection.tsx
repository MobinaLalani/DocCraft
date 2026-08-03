"use client";

import { Field, inputClass } from "@/components/docs/builder/shared";

import type { DocPage } from "@/lib/docs/schema";
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
      <div className="mb-5">
        <p className="text-sm font-medium text-slate-500">تعریف صفحه</p>

        <h3 className="text-2xl font-semibold text-slate-950">
          تنظیمات صفحه فعال
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="عنوان صفحه">
          <input
            className={inputClass}
            value={activePage.title}
            onChange={(e) =>
              onUpdatePage((page) => ({
                ...page,
                title: e.target.value,
              }))
            }
          />
        </Field>

        <Field label="Slug">
          <input
            className={inputClass}
            value={activePage.slug}
            onChange={(e) => onUpdatePageSlug(e.target.value)}
          />
        </Field>

        <Field label="گروه منو">
          <select
            className={inputClass}
            value={activePage.menuGroupId}
            onChange={(e) =>
              onUpdatePage((page) => ({
                ...page,
                menuGroupId: e.target.value,
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
            onChange={(e) =>
              onUpdatePage((page) => ({
                ...page,
                menuTitle: e.target.value,
              }))
            }
          />
        </Field>
      </div>

      <Field label="توضیحات صفحه" className="mt-4">
        <textarea
          className={`${inputClass} min-h-28`}
          value={activePage.description ?? ""}
          onChange={(e) =>
            onUpdatePage((page) => ({
              ...page,
              description: e.target.value,
            }))
          }
        />
      </Field>
    </section>
  );
}
