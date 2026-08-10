"use client";

import type { ParsedController } from "../model/index";

import { ControllerItem } from "./ControllerItem";

type ControllerListProps = {
  controllers: ParsedController[];

  expandedControllers: Set<string>;

  onToggleController: (tag: string) => void;
  onToggleEndpoint: (tag: string, index: number) => void;
  onToggleExpand: (tag: string) => void;

  onSelectAllEndpoints: (tag: string, checked: boolean) => void;
  onUpdateControllerName: (tag: string, name: string) => void;
  onDragController: (tag: string) => void;
  onDragEndpoint: (tag: string, endpointIndex: number) => void;
  onDragEnd: () => void;
};

export function ControllerList({
  controllers,
  expandedControllers,
  onToggleExpand,
  onToggleController,
  onToggleEndpoint,
  onSelectAllEndpoints,
  onUpdateControllerName,
  onDragController,
  onDragEndpoint,
  onDragEnd,
}: ControllerListProps) {
  if (controllers.length === 0) {
    return (
      <div className="py-10 text-center text-slate-400">نتیجه‌ای یافت نشد.</div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {controllers.map((controller) => (
        <ControllerItem
          key={controller.tag}
          controller={controller}
          expanded={expandedControllers.has(controller.tag)}
          onToggleExpand={() => onToggleExpand(controller.tag)}
          onToggleController={() => onToggleController(controller.tag)}
          onToggleEndpoint={onToggleEndpoint}
          onSelectAllEndpoints={onSelectAllEndpoints}
          onUpdateName={onUpdateControllerName}
          onDragController={() => onDragController(controller.tag)}
          onDragEndpoint={(index) => onDragEndpoint(controller.tag, index)}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}
