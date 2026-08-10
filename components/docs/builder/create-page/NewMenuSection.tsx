"use client";

import { useState } from "react";

import { Field, inputClass } from "@/components/docs/builder/shared";
import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";

type NewMenuSectionProps = {
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

export function NewMenuSection({
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
}: NewMenuSectionProps) {
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [blockedDeleteMenu, setBlockedDeleteMenu] = useState<MenuGroup | null>(
    null,
  );
  const isMenuTitleEmpty = createMenuTitle.trim().length === 0;

  const resetForm = () => {
    setEditingMenuId(null);
    onResetMenuForm();
    onSetNewMenuActive(true);
  };

  const handleSubmit = async () => {
    if (isMenuTitleEmpty) {
      setSaveMessage("عنوان منو را وارد کن.");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      if (editingMenuId) {
        await onSaveMenuGroupChanges(editingMenuId, {
          title: createMenuTitle,
          description: createMenuDescription,
          isActive: createMenuIsActive,
        });
        setSaveMessage("تغییرات منو با موفقیت ذخیره شد.");
      } else {
        await onCreateMenu();
        setSaveMessage("منوی جدید با موفقیت ایجاد شد.");
      }

      resetForm();
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "ذخیره منو انجام نشد.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMenu = (menuGroup: MenuGroup) => {
    setEditingMenuId(menuGroup.id);
    onSetNewMenuTitle(menuGroup.title);
    onSetNewMenuDescription(menuGroup.description ?? "");
    onSetNewMenuActive(menuGroup.isActive);
    setSaveMessage(null);
  };

  const handleDeleteMenu = async (menuGroup: MenuGroup) => {
    const isUsed = pages.some((page) => page.menuGroupId === menuGroup.id);

    if (isUsed) {
      setBlockedDeleteMenu(menuGroup);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await onDeleteMenuGroup(menuGroup.id);
      if (editingMenuId === menuGroup.id) {
        resetForm();
      }
      setSaveMessage("منو با موفقیت حذف شد.");
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "حذف منو انجام نشد.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="space-y-6">
        <div className="space-y-4">
          <Field label="عنوان منو">
            <input
              className={`${inputClass} w-full min-w-0 !rounded-xl ${
                isMenuTitleEmpty ? "border-rose-300 focus:border-rose-400" : ""
              }`}
              value={createMenuTitle}
              onChange={(event) => onSetNewMenuTitle(event.target.value)}
              placeholder="مثلا احراز هویت"
            />
            {isMenuTitleEmpty ? (
              <p className="mt-2 text-sm text-rose-600">
                عنوان منو نمی‌تواند خالی باشد.
              </p>
            ) : null}
          </Field>

          <Field label="توضیح منو">
            <textarea
              className={`${inputClass} min-h-24 w-full min-w-0 resize-y !rounded-xl`}
              value={createMenuDescription}
              onChange={(event) => onSetNewMenuDescription(event.target.value)}
              placeholder="توضیح کوتاه درباره این گروه منو"
            />
          </Field>

          <Field label="وضعیت نمایش در منو">
            <select
              className={`${inputClass} w-full min-w-0 !rounded-xl`}
              value={createMenuIsActive ? "active" : "inactive"}
              onChange={(event) =>
                onSetNewMenuActive(event.target.value === "active")
              }
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </Field>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 rounded-xl bg-sky-50 p-5">
            <div>
              <p className="text-sm font-medium text-sky-700">
                {editingMenuId ? "ویرایش منو" : "ایجاد منوی جدید"}
              </p>
              <p className="mt-1 text-sm text-sky-900/80">
                {editingMenuId
                  ? "اطلاعات منوی انتخاب‌شده از جدول در فرم بالا قرار گرفته است."
                  : "اطلاعات منوی جدید را در فرم بالا وارد کن و سپس ثبتش کن."}
              </p>
              {saveMessage ? (
                <p className="mt-2 text-sm text-sky-700">{saveMessage}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving || isMenuTitleEmpty}
                className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {isSaving
                  ? "در حال ذخیره..."
                  : editingMenuId
                    ? "ذخیره تغییرات"
                    : "ایجاد منو"}
              </button>

              {editingMenuId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                >
                  انصراف از ویرایش
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-200 pt-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">
              منوهای تعریف شده
            </p>
            <h4 className="text-lg font-semibold text-slate-950">
              ویرایش منوهای موجود
            </h4>
          </div>

          {menuGroups.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className=" text-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-right font-semibold">
                        عنوان منو
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        توضیح
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        وضعیت
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        تعداد استفاده
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {menuGroups.map((menuGroup) => {
                      const usageCount = pages.filter(
                        (page) => page.menuGroupId === menuGroup.id,
                      ).length;

                      return (
                        <tr key={menuGroup.id} className="align-top">
                          <td className="px-4 py-4 font-medium text-slate-950">
                            {menuGroup.title}
                          </td>
                          <td className="max-w-xs px-4 py-4 text-slate-600">
                            {menuGroup.description?.trim() ||
                              "توضیحی برای این منو ثبت نشده است."}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-xl px-3 py-1 text-xs font-medium ${
                                menuGroup.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {menuGroup.isActive ? "فعال" : "غیرفعال"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {usageCount} صفحه
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditMenu(menuGroup)}
                                className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                              >
                                ویرایش
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMenu(menuGroup)}
                                className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                              >
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
              هنوز هیچ منویی تعریف نشده است.
            </div>
          )}
        </div>
      </div>

      {blockedDeleteMenu ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="space-y-3 text-right">
              <p className="text-sm font-medium text-rose-600">
                امکان حذف وجود ندارد
              </p>
              <h4 className="text-xl font-semibold text-slate-950">
                این منو در حال استفاده است
              </h4>
              <p className="text-sm leading-7 text-slate-600">
                منوی{" "}
                <span className="font-medium">{blockedDeleteMenu.title}</span>{" "}
                به یک یا چند صفحه متصل است. تا وقتی صفحه‌ای با این منو ساخته شده
                باشد، حذف آن امکان‌پذیر نیست.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setBlockedDeleteMenu(null)}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
