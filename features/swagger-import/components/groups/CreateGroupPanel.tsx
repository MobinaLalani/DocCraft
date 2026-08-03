"use client";

import { CheckCircle2, Layers, XCircle } from "lucide-react";

import type { ParsedController } from "../model/index";

type CreateGroupPanelProps = {
  controllers: ParsedController[];

  newGroupName: string;

  newGroupTags: Set<string>;

  onNewGroupNameChange: (value: string) => void;

  onToggleNewGroupTag: (tag: string) => void;

  onConfirmCreateGroup: () => void;

  onCancelCreateGroup: () => void;
};

export function CreateGroupPanel({
  controllers,
  newGroupName,
  newGroupTags,
  onNewGroupNameChange,
  onToggleNewGroupTag,
  onConfirmCreateGroup,
  onCancelCreateGroup,
}: CreateGroupPanelProps) {
  return (
    <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-sky-700" />
          <h3 className="font-semibold">ایجاد گروه</h3>
        </div>

        <button type="button" onClick={onCancelCreateGroup}>
          <XCircle className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      <input
        value={newGroupName}
        onChange={(e) => onNewGroupNameChange(e.target.value)}
        placeholder="نام گروه"
        className="mb-5 w-full rounded-xl border bg-white px-4 py-3"
      />

      <div className="flex flex-wrap gap-2">
        {controllers.map((controller) => {
          const checked = newGroupTags.has(controller.tag);

          return (
            <button
              key={controller.tag}
              type="button"
              onClick={() => onToggleNewGroupTag(controller.tag)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                checked ? "border-sky-600 bg-sky-600 text-white" : "bg-white"
              }`}
            >
              {checked && <CheckCircle2 className="mr-1 inline h-3 w-3" />}

              {controller.customName}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-6 rounded-xl bg-sky-700 px-5 py-3 text-white"
        disabled={newGroupTags.size < 2 || !newGroupName.trim()}
        onClick={onConfirmCreateGroup}
      >
        ایجاد گروه
      </button>
    </div>
  );
}
