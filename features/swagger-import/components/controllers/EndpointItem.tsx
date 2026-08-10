"use client";

import type { ParsedEndpoint } from "../model/index";
import { GripVertical } from "lucide-react";

import { IndeterminateCheckbox } from "../shared/IndeterminateCheckbox";
import { MethodBadge } from "../shared/MethodBadge";

type Props = {
  endpoint: ParsedEndpoint;

  onToggle: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export function EndpointItem({ endpoint, onToggle, onDragStart, onDragEnd }: Props) {
  return (
    <label className="flex items-center gap-3 px-8 py-2 hover:bg-slate-100">
      <span
        draggable
        onDragStart={(event) => {
          onDragStart();
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", `${endpoint.method} ${endpoint.path}`);
        }}
        onDragEnd={onDragEnd}
        onClick={(event) => event.preventDefault()}
        className="cursor-grab text-slate-400 active:cursor-grabbing"
        title="کشیدن API به گروه"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </span>
      <IndeterminateCheckbox
        checked={endpoint.selected}
        indeterminate={false}
        onChange={onToggle}
        size="sm"
      />ّ

      <MethodBadge method={endpoint.method} />

      <span className="flex-1 font-mono text-xs">{endpoint.path}</span>

      {endpoint.summary && (
        <span className="text-xs text-slate-400">{endpoint.summary}</span>
      )}
    </label>
  );
}
