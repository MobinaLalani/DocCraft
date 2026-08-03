"use client";

import type { ParsedController } from "../model/index";

import { EndpointItem } from "./EndpointItem";

type Props = {
  controller: ParsedController;

  onToggleEndpoint: (tag: string, index: number) => void;

  onSelectAllEndpoints: (tag: string, checked: boolean) => void;
  onDragEndpoint: (index: number) => void;
  onDragEnd: () => void;
};

export function EndpointList({
  controller,
  onToggleEndpoint,
  onSelectAllEndpoints,
  onDragEndpoint,
  onDragEnd,
}: Props) {
  return (
    <div className="bg-slate-50">
      <div className="flex justify-between border-b px-8 py-2">
        <button onClick={() => onSelectAllEndpoints(controller.tag, true)}>
          انتخاب همه
        </button>

        <button onClick={() => onSelectAllEndpoints(controller.tag, false)}>
          لغو همه
        </button>
      </div>

      {controller.endpoints.map((endpoint, index) => (
        <EndpointItem
          key={`${endpoint.method}-${endpoint.path}`}
          endpoint={endpoint}
          onToggle={() => onToggleEndpoint(controller.tag, index)}
          onDragStart={() => onDragEndpoint(index)}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}
