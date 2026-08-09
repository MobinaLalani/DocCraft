"use client";

import { useState } from "react";

import type { ControllerGroup, ParsedController } from "../model/index";

import { ControllerList } from "../controllers/ControllerList";
import { CreateGroupPanel } from "../groups/CreateGroupPanel";
import { GroupSection } from "../groups/GroupSection";
import { StatChip } from "../shared/StatChip";

type SelectStepProps = {
  controllers: ParsedController[];
  groups: ControllerGroup[];

  expandedControllers: Set<string>;
  expandedGroups: Set<string>;

  creatingGroup: boolean;

  newGroupName: string;
  newGroupTags: Set<string>;

  search: string;

  onSearchChange: (value: string) => void;

  // Controller
  onToggleController: (tag: string) => void;
  onToggleEndpoint: (tag: string, index: number) => void;
  onToggleExpand: (tag: string) => void;
  onUpdateControllerName: (tag: string, name: string) => void;

  // Create Group
  onStartCreateGroup: () => void;
  onCancelCreateGroup: () => void;
  onNewGroupNameChange: (value: string) => void;
  onToggleNewGroupTag: (tag: string) => void;
  onConfirmCreateGroup: () => void;

  // Groups
  onDeleteGroup: (id: string) => void;
  onRemoveFromGroup: (groupId: string, tag: string) => void;
  onRemoveEndpointFromGroup: (groupId: string, key: string) => void;
  onAddControllerToGroup: (groupId: string, tag: string) => void;
  onDropIntoGroup: (
    groupId: string,
    item: { type: "controller"; tag: string } | { type: "endpoint"; tag: string; endpointIndex: number },
  ) => void;
  onUpdateGroupName: (id: string, name: string) => void;
  onToggleGroupExpand: (id: string) => void;

  onImport: () => void;
};
export function SelectStep({
  expandedGroups,
  expandedControllers,
  controllers,
  groups,
  creatingGroup,
  newGroupName,
  newGroupTags,
  search,
  onSearchChange,
  onToggleController,
  onToggleEndpoint,
  onToggleExpand,
  onUpdateControllerName,
  onStartCreateGroup,
  onNewGroupNameChange,
  onToggleNewGroupTag,
  onConfirmCreateGroup,
  onCancelCreateGroup,
  onDeleteGroup,
  onRemoveFromGroup,
  onRemoveEndpointFromGroup,
  onAddControllerToGroup,
  onDropIntoGroup,
  onUpdateGroupName,
  onToggleGroupExpand,
  onImport,
}: SelectStepProps) {
  const [dragItem, setDragItem] = useState<
    { type: "controller"; tag: string } | { type: "endpoint"; tag: string; endpointIndex: number } | null
  >(null);
  const groupedTags = new Set(groups.flatMap((group) => group.tags));
  const visibleControllers = controllers.filter((controller) => !groupedTags.has(controller.tag));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <StatChip label="Controller" value={controllers.length} />

        <StatChip label="Group" value={groups.length} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="جست‌وجوی Controller"
          className="min-w-56 flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-sky-400"
        />
        {!creatingGroup && (
          <button type="button" onClick={onStartCreateGroup} className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            گروه‌بندی
          </button>
        )}
      </div>

      {creatingGroup && (
        <CreateGroupPanel
          controllers={controllers}
          newGroupName={newGroupName}
          newGroupTags={newGroupTags}
          onNewGroupNameChange={onNewGroupNameChange}
          onToggleNewGroupTag={onToggleNewGroupTag}
          onConfirmCreateGroup={onConfirmCreateGroup}
          onCancelCreateGroup={onCancelCreateGroup}
        />
      )}

      <GroupSection
        groups={groups}
        controllers={controllers}
        expandedGroups={expandedGroups}
        onDeleteGroup={onDeleteGroup}
        onRemoveFromGroup={onRemoveFromGroup}
        onRemoveEndpointFromGroup={onRemoveEndpointFromGroup}
        onAddControllerToGroup={onAddControllerToGroup}
        dragItem={dragItem}
        onDropIntoGroup={(groupId) => {
          if (dragItem) onDropIntoGroup(groupId, dragItem);
          setDragItem(null);
        }}
        onUpdateGroupName={onUpdateGroupName}
        onToggleGroupExpand={onToggleGroupExpand}
      />

      <ControllerList
        controllers={visibleControllers.filter((controller) =>
          !search.trim() || controller.customName.toLowerCase().includes(search.toLowerCase()) || controller.tag.toLowerCase().includes(search.toLowerCase()),
        )}
        expandedControllers={expandedControllers}
        onToggleController={onToggleController}
        onToggleEndpoint={onToggleEndpoint}
        onToggleExpand={onToggleExpand}
        onSelectAllEndpoints={(tag, checked) => {
          // بعداً در hook اضافه می‌کنیم
          console.log(tag, checked);
        }}
        onUpdateControllerName={onUpdateControllerName}
        onDragController={(tag) => setDragItem({ type: "controller", tag })}
        onDragEndpoint={(tag, endpointIndex) => setDragItem({ type: "endpoint", tag, endpointIndex })}
        onDragEnd={() => setDragItem(null)}
      />
      <div className="flex justify-end">
        <button type="button" onClick={onImport} className="rounded-2xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-600">
          تولید داکیومنت
        </button>
      </div>
    </div>
  );
}
