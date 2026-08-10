import { createElement, useState } from "react";

import type { PageComponent } from "@/lib/docs/schema";

import {
  getBlockTypeIcon,
  getBlockTypeLabel,
} from "@/components/docs/builder/constants";
import { inspectorRegistry } from "@/components/docs/builder/inspector/registry";
import type {
  InspectorProps,
  InspectorTab,
} from "@/components/docs/builder/inspector/types";

type InspectorPanelProps = {
  selectedComponent: PageComponent | null;
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void;
};

export function InspectorPanel({
  selectedComponent,
  onUpdateSelectedComponent,
}: InspectorPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        یک بلوک را از بوم صفحه انتخاب کن تا تنظیماتش اینجا نمایش داده شود.
      </div>
    );
  }

  return (
    <SelectedInspectorPanel
      key={selectedComponent.id}
      selectedComponent={selectedComponent}
      onUpdateSelectedComponent={onUpdateSelectedComponent}
    />
  );
}

function SelectedInspectorPanel({
  selectedComponent,
  onUpdateSelectedComponent,
}: InspectorPanelProps & { selectedComponent: PageComponent }) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("properties");
  const BlockTypePanel = renderInspector(
    selectedComponent,
    onUpdateSelectedComponent,
    activeTab,
  );
  const blockLabel = getBlockTypeLabel(selectedComponent.type);

  return (
    <div className="mt-4 space-y-5">
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
            {createElement(getBlockTypeIcon(selectedComponent.type), {
              className: "h-5 w-5",
              strokeWidth: 2,
            })}
          </div>
          <div>
            <p className="text-xs text-slate-500">نوع بلوک</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {blockLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 rounded-2xl  p-1">
        <InspectorTabButton
          label={selectedComponent.type === "image" ? "محتوا" : "Properties"}
          isActive={activeTab === "properties"}
          onClick={() => setActiveTab("properties")}
        />
        <InspectorTabButton
          label={selectedComponent.type === "image" ? "تنظیمات ظاهر" : "Data"}
          isActive={activeTab === "data"}
          onClick={() => setActiveTab("data")}
        />
      </div>

      {BlockTypePanel}
    </div>
  );
}

function InspectorTabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-600 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

function renderInspector<T extends PageComponent>(
  selectedComponent: T,
  onUpdateSelectedComponent: (
    updater: (component: PageComponent) => PageComponent,
  ) => void,
  activeTab: InspectorTab,
) {
const Inspector = inspectorRegistry[
  selectedComponent.type
] as unknown as React.ComponentType<InspectorProps<T>>;

  return (
    <Inspector
      component={selectedComponent}
      activeTab={activeTab}
      onChange={(updater) =>
        onUpdateSelectedComponent(
          (component) => updater(component as T) as PageComponent,
        )
      }
    />
  );
}
