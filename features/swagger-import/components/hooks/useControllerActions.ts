"use client";

import type { ParsedController } from "../model";

type Props = {
  setControllers: React.Dispatch<React.SetStateAction<ParsedController[]>>;

  setExpandedControllers: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function useControllerActions({
  setControllers,
  setExpandedControllers,
}: Props) {
  function toggleController(tag: string) {
    setControllers((prev) =>
      prev.map((controller) => {
        if (controller.tag !== tag) return controller;

        const selected = !controller.selected;

        return {
          ...controller,

          selected,

          endpoints: controller.endpoints.map((endpoint) => ({
            ...endpoint,
            selected,
          })),
        };
      }),
    );
  }

  function toggleEndpoint(tag: string, index: number) {
    setControllers((prev) =>
      prev.map((controller) => {
        if (controller.tag !== tag) return controller;

        const endpoints = controller.endpoints.map((endpoint, i) =>
          i === index
            ? {
                ...endpoint,
                selected: !endpoint.selected,
              }
            : endpoint,
        );

        return {
          ...controller,

          endpoints,

          selected: endpoints.some((e) => e.selected),
        };
      }),
    );
  }

  function renameController(tag: string, value: string) {
    setControllers((prev) =>
      prev.map((controller) =>
        controller.tag === tag
          ? {
              ...controller,
              customName: value,
            }
          : controller,
      ),
    );
  }

  function toggleExpand(tag: string) {
    setExpandedControllers((prev) => {
      const next = new Set(prev);

      if (next.has(tag)) next.delete(tag);
      else next.add(tag);

      return next;
    });
  }

  return {
    toggleController,

    toggleEndpoint,

    renameController,

    toggleExpand,
  };
}
