"use client";

import { useSwaggerImport } from "./hooks/useSwaggerImport";
import { useControllerActions } from "./hooks/useControllerActions";
import { useGroupActions } from "./hooks/useGroupActions";
import { useImportActions } from "./hooks/useImportActions";

import { UrlStep } from "./steps/UrlStep";
import { SelectStep } from "./steps/SelectStep";
import { ResultStep } from "./steps/ResultStep";

import { StepIndicator } from "./shared/StepIndicator";

export function SwaggerImportWizard() {
  const wizard = useSwaggerImport();

  const controller = useControllerActions({
    setControllers: wizard.setControllers,
    setExpandedControllers: wizard.setExpandedControllers,
  });

  const group = useGroupActions({
    newGroupName: wizard.newGroupName,
    newGroupTags: wizard.newGroupTags,

    setGroups: wizard.setGroups,

    setExpandedGroups: wizard.setExpandedGroups,

    setCreatingGroup: wizard.setCreatingGroup,

    setNewGroupName: wizard.setNewGroupName,

    setNewGroupTags: wizard.setNewGroupTags,
  });

const importer = useImportActions({
  url: wizard.url,

  controllers: wizard.controllers,

  groups: wizard.groups,

  setStep: wizard.setStep,
  setState: wizard.setState,
  setError: wizard.setError,
  setSpec: wizard.setSpec,
  setControllers: wizard.setControllers,
  setGroups: wizard.setGroups,
  setUrl: wizard.setUrl,
  setSearch: wizard.setSearch,
  setExpandedControllers: wizard.setExpandedControllers,
  setExpandedGroups: wizard.setExpandedGroups,
  setCreatingGroup: wizard.setCreatingGroup,
  setNewGroupName: wizard.setNewGroupName,
  setNewGroupTags: wizard.setNewGroupTags,
});
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              Swagger / OpenAPI Import
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              ایجاد داکیومنت از API
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              لینک فایل OpenAPI را وارد کنید تا صفحات داکیومنت ساخته شوند.
            </p>
          </div>

          <StepIndicator current={wizard.step} />
        </div>
      </div>

      {wizard.step === "url" && (
        <UrlStep
          url={wizard.url}
          setUrl={wizard.setUrl}
          error={wizard.error}
          state={wizard.state}
          fetchSwagger={importer.fetchSwagger}
        />
      )}

      {wizard.step === "select" && (
        <SelectStep
          controllers={wizard.controllers}
          groups={wizard.groups}
          expandedControllers={wizard.expandedControllers}
          expandedGroups={wizard.expandedGroups}
          search={wizard.search}
          creatingGroup={wizard.creatingGroup}
          newGroupName={wizard.newGroupName}
          newGroupTags={wizard.newGroupTags}
          onSearchChange={wizard.setSearch}
          onToggleController={controller.toggleController}
          onToggleEndpoint={controller.toggleEndpoint}
          onToggleExpand={controller.toggleExpand}
          onUpdateControllerName={controller.renameController}
          onStartCreateGroup={() => wizard.setCreatingGroup(true)}
          onCancelCreateGroup={() => {
            wizard.setCreatingGroup(false);
            wizard.setNewGroupName("");
            wizard.setNewGroupTags(new Set());
          }}
          onNewGroupNameChange={wizard.setNewGroupName}
          onToggleNewGroupTag={group.toggleTag}
          onConfirmCreateGroup={group.createGroup}
          onDeleteGroup={group.deleteGroup}
          onRemoveFromGroup={group.removeController}
          onRemoveEndpointFromGroup={group.removeEndpoint}
          onDropIntoGroup={group.dropIntoGroup}
          onUpdateGroupName={group.renameGroup}
          onToggleGroupExpand={group.toggleExpand}
          onImport={importer.importDocs}
        />
      )}

      {wizard.step === "result" && (
        <ResultStep
          importedCount={importer.importedCount}
          endpointCount={importer.endpointCount}
          groupCount={importer.groupCount}
          reset={importer.reset}
        />
      )}
    </div>
  );
}
