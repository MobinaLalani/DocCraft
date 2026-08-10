"use client";

import { ChevronDown, Layers, Trash2 } from "lucide-react";

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
  onDrop,
  canDrop,
}: Props) {
  const groupControllers = controllers.filter((controller) => group.tags.includes(controller.tag));
  const individualEndpoints = controllers.flatMap((controller) =>
    controller.endpoints.flatMap((endpoint, index) => {
      const key = `${controller.tag}\u0000${index}`;
      return group.endpointKeys?.includes(key) ? [{ controller, endpoint, key }] : [];
    }),
  );
  return (
    <div className="border-b">
      <div
        onDragOver={(event) => { if (canDrop) event.preventDefault(); }}
        onDrop={(event) => { event.preventDefault(); onDrop(); }}
        className={`flex items-center gap-3 p-4 transition ${canDrop ? "hover:bg-sky-50 hover:ring-2 hover:ring-inset hover:ring-sky-400" : ""}`}
      >
        <Layers className="h-5 w-5 text-sky-700" />

        <input
          value={group.name}
          onChange={(e) => onRename(e.target.value)}
          className="flex-1 bg-transparent font-semibold outline-none"
        />

        <button onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>

        <button onClick={onToggle}>
          <ChevronDown
            className={`transition ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="bg-slate-50">
          {groupControllers.map((controller) => (
            <div
              key={controller.tag}
              className="flex items-center justify-between px-10 py-3"
            >
              <span>{controller.customName}</span>

              <button
                onClick={() => onRemoveController(controller.tag)}
                className="text-xs text-red-500"
              >
                حذف
              </button>
            </div>
          ))}
          {individualEndpoints.map(({ controller, endpoint, key }) => (
            <div key={key} className="flex items-center gap-3 border-t border-slate-200 px-10 py-3">
              <span className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase">{endpoint.method}</span>
              <code className="min-w-0 flex-1 truncate text-xs" dir="ltr">{endpoint.path}</code>
              <span className="text-xs text-slate-400">{controller.customName}</span>
              <button onClick={() => onRemoveEndpoint(key)} className="text-xs text-red-500">حذف</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
