"use client";

import { NewMenuSection } from "@/components/docs/builder/create-page/NewMenuSection";

import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";

type MenuManagementSectionProps = {
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

export function MenuManagementSection({
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
}: MenuManagementSectionProps) {
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
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium text-slate-500">مدیریت منوها</p>

        <h3
          className="
          text-3xl
          font-semibold
          tracking-tight
          text-slate-950
        "
        >
          تعریف و ویرایش منوها
        </h3>

        <p
          className="
          text-sm
          leading-7
          text-slate-600
        "
        >
          از این بخش می‌توانی منوی جدید بسازی، وضعیت نمایش آن را تغییر بدهی و
          منوهای قبلی را مدیریت کنی.
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
