"use client";

import type { ControllerGroup } from "../model";

import { uid } from "../utils/uid";

type Props = {
  newGroupName: string;

  newGroupTags: Set<string>;

  setGroups: React.Dispatch<React.SetStateAction<ControllerGroup[]>>;

  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;

  setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>;

  setNewGroupName: React.Dispatch<React.SetStateAction<string>>;

  setNewGroupTags: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function useGroupActions({
  newGroupName,
  newGroupTags,
  setGroups,
  setExpandedGroups,
  setCreatingGroup,
  setNewGroupName,
  setNewGroupTags,
}: Props) {
  function toggleTag(tag: string) {
    setNewGroupTags((prev) => {
      const next = new Set(prev);

      if (next.has(tag)) next.delete(tag);
      else next.add(tag);

      return next;
    });
  }

  function createGroup() {
    if (!newGroupName.trim()) return;

    if (newGroupTags.size < 2) return;

    setGroups((prev) => [
      ...prev,
      {
        id: uid(),

        name: newGroupName,

        tags: [...newGroupTags],
      },
    ]);

    setCreatingGroup(false);

    setNewGroupName("");

    setNewGroupTags(new Set());
  }

  function deleteGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  function renameGroup(id: string, value: string) {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === id
          ? {
              ...group,
              name: value,
            }
          : group,
      ),
    );
  }

  function removeController(groupId: string, tag: string) {
    setGroups((prev) =>
      prev
        .map((group) =>
          group.id === groupId
            ? {
                ...group,
                tags: group.tags.filter((t) => t !== tag),
              }
            : group,
        )
        .filter((group) => group.tags.length + (group.endpointKeys?.length ?? 0) > 0),
    );
  }

  function removeEndpoint(groupId: string, key: string) {
    setGroups((prev) =>
      prev
        .map((group) =>
          group.id === groupId
            ? { ...group, endpointKeys: (group.endpointKeys ?? []).filter((item) => item !== key) }
            : group,
        )
        .filter((group) => group.tags.length + (group.endpointKeys?.length ?? 0) > 0),
    );
  }

  function addController(groupId: string, tag: string) {
    dropIntoGroup(groupId, { type: "controller", tag });
  }

  function dropIntoGroup(
    groupId: string,
    item: { type: "controller"; tag: string } | { type: "endpoint"; tag: string; endpointIndex: number },
  ) {
    setGroups((prev) => {
      if (item.type === "controller") {
        return prev
          .map((group) => ({
            ...group,
            tags: group.id === groupId
              ? [...group.tags.filter((tag) => tag !== item.tag), item.tag]
              : group.tags.filter((tag) => tag !== item.tag),
            endpointKeys: (group.endpointKeys ?? []).filter((key) => !key.startsWith(`${item.tag}\u0000`)),
          }))
          .filter((group) => group.tags.length + (group.endpointKeys?.length ?? 0) > 0);
      }

      const key = `${item.tag}\u0000${item.endpointIndex}`;
      return prev
        .map((group) => ({
          ...group,
          endpointKeys: group.id === groupId
            ? group.tags.includes(item.tag)
              ? (group.endpointKeys ?? []).filter((entry) => entry !== key)
              : [...(group.endpointKeys ?? []).filter((entry) => entry !== key), key]
            : (group.endpointKeys ?? []).filter((entry) => entry !== key),
        }))
        .filter((group) => group.tags.length + (group.endpointKeys?.length ?? 0) > 0);
    });
    setExpandedGroups((prev) => new Set(prev).add(groupId));
  }

  function toggleExpand(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  return {
    toggleTag,

    createGroup,

    deleteGroup,

    renameGroup,

    removeController,
    removeEndpoint,
    addController,
    dropIntoGroup,

    toggleExpand,
  };
}
