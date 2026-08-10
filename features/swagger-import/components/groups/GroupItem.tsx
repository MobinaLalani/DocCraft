"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  GripVertical,
  Layers,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import type { ControllerGroup, ParsedController } from "../model/index";

type Props = {
  group: ControllerGroup;
  controllers: ParsedController[];
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (value: string) => void;
  onRemoveController: (tag: string) => void;
  onRemoveEndpoint: (key: string) => void;
  onAddController: (tag: string) => void;
  onDrop: () => void;
  canDrop: boolean;
};

export function GroupItem({
  group,
  controllers,
  expanded,
  onToggle,
  onDelete,
  onRename,
  onRemoveController,
  onRemoveEndpoint,
  onAddController,
  onDrop,
  canDrop,
}: Props) {
  const [editing, setEditing] = useState(false);
  const groupControllers = controllers.filter((controller) =>
    group.tags.includes(controller.tag),
  );
  const availableControllers = controllers.filter(
    (controller) => !group.tags.includes(controller.tag),
  );
  const individualEndpoints = controllers.flatMap((controller) =>
    controller.endpoints.flatMap((endpoint, index) => {
      const key = `${controller.tag}\u0000${index}`;
      return group.endpointKeys?.includes(key)
        ? [{ controller, endpoint, key }]
        : [];
    }),
  );

  return (
    <div className="border-b last:border-b-0">
      <div
        onDragOver={(event) => {
          if (canDrop) event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          onDrop();
        }}
        className={`flex items-center gap-3 p-4 transition ${
          canDrop
            ? "bg-sky-50/60 ring-2 ring-inset ring-sky-400"
            : "hover:bg-slate-50"
        }`}
      >
        <Layers className="h-5 w-5 text-sky-700" />
        <input
          value={group.name}
          onChange={(event) => onRename(event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
          aria-label="نام گروه"
        />
        {canDrop && (
          <span className="hidden items-center gap-1 rounded-full bg-sky-600 px-3 py-1 text-xs text-white sm:flex">
            <GripVertical className="h-3 w-3" /> اینجا رها کنید
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            setEditing((value) => !value);
            if (!expanded) onToggle();
          }}
          className={`rounded-lg p-2 transition ${
            editing
              ? "bg-sky-100 text-sky-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
          title={editing ? "پایان ویرایش" : "ویرایش گروه‌بندی"}
          aria-label={editing ? "پایان ویرایش گروه" : "ویرایش گروه"}
        >
          {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-2 hover:bg-red-50"
          aria-label="حذف گروه"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
        <button type="button" onClick={onToggle} aria-label="نمایش اعضای گروه">
          <ChevronDown
            className={`transition ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="bg-slate-50">
          {editing && (
            <div className="border-y border-sky-100 bg-sky-50/70 px-6 py-4">
              <p className="text-sm font-semibold text-slate-700">
                افزودن سرگروه
              </p>
              <p className="mb-3 mt-1 text-xs text-slate-500">
                یک Controller را انتخاب کنید یا یک API تکی را روی این گروه رها کنید.
              </p>
              {availableControllers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableControllers.map((controller) => (
                    <button
                      key={controller.tag}
                      type="button"
                      onClick={() => onAddController(controller.tag)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-500 hover:text-sky-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {controller.customName}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  سرگروه دیگری برای افزودن وجود ندارد.
                </p>
              )}
            </div>
          )}

          {groupControllers.map((controller) => (
            <div
              key={controller.tag}
              className="flex items-center justify-between px-10 py-3"
            >
              <span>{controller.customName}</span>
              <button
                type="button"
                onClick={() => onRemoveController(controller.tag)}
                className="inline-flex items-center gap-1 text-xs text-red-500"
              >
                <X className="h-3 w-3" /> حذف
              </button>
            </div>
          ))}

          {individualEndpoints.map(({ controller, endpoint, key }) => (
            <div
              key={key}
              className="flex items-center gap-3 border-t border-slate-200 px-10 py-3"
            >
              <span className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase">
                {endpoint.method}
              </span>
              <code className="min-w-0 flex-1 truncate text-xs" dir="ltr">
                {endpoint.path}
              </code>
              <span className="text-xs text-slate-400">
                {controller.customName}
              </span>
              <button
                type="button"
                onClick={() => onRemoveEndpoint(key)}
                className="inline-flex items-center gap-1 text-xs text-red-500"
              >
                <X className="h-3 w-3" /> حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
