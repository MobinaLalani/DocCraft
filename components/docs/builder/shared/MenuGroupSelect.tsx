"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { QuickCreateMenuModal } from "@/components/docs/builder/create-page/QuickCreateMenuModal";
import { inputClass } from "@/components/docs/builder/shared";
import type { MenuGroup } from "@/lib/docs/workspace";

export type QuickMenuFormProps = {
  title: string;
  description: string;
  isActive: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onActiveChange: (value: boolean) => void;
  onCreate: () => void | Promise<void>;
  onReset: () => void;
};

type MenuGroupSelectProps = {
  menuGroups: MenuGroup[];
  value: string;
  onChange: (menuGroupId: string) => void;
  quickCreate?: QuickMenuFormProps;
};

export function MenuGroupSelect({
  menuGroups,
  value,
  onChange,
  quickCreate,
}: MenuGroupSelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingSelection = useRef(false);

  useEffect(() => {
    if (!pendingSelection.current) return;
    const createdMenu = menuGroups.at(-1);
    if (!createdMenu) return;
    onChange(createdMenu.id);
    pendingSelection.current = false;
  }, [menuGroups, onChange]);

  const closeModal = () => {
    quickCreate?.onReset();
    setIsModalOpen(false);
  };

  const createMenu = async () => {
    if (!quickCreate) return;
    pendingSelection.current = true;
    try {
      await quickCreate.onCreate();
    } catch (error) {
      pendingSelection.current = false;
      throw error;
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">گروه منو</span>
      <div className="flex w-full items-stretch gap-2">
        <select
          className={`${inputClass} min-w-0 flex-1 !rounded-xl`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
        {quickCreate ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex aspect-square shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            aria-label="افزودن منوی جدید"
            title="افزودن منوی جدید"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {quickCreate && isModalOpen ? (
        <QuickCreateMenuModal
          title={quickCreate.title}
          description={quickCreate.description}
          isActive={quickCreate.isActive}
          onTitleChange={quickCreate.onTitleChange}
          onDescriptionChange={quickCreate.onDescriptionChange}
          onActiveChange={quickCreate.onActiveChange}
          onCreate={createMenu}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
}
