"use client";

import { useState } from "react";

import type {
  ControllerGroup,
  ImportState,
  OpenApiSpec,
  ParsedController,
  SwaggerStep,
} from "../model";

import { fetchSwaggerSpec } from "../services/swaggerImport.service";

import { parseControllers } from "../lib/parseOpenApi";

type Props = {
  url: string;

  controllers: ParsedController[];

  groups: ControllerGroup[];

  setStep: React.Dispatch<React.SetStateAction<SwaggerStep>>;

  setState: React.Dispatch<React.SetStateAction<ImportState>>;

  setError: React.Dispatch<React.SetStateAction<string | null>>;

  setSpec: React.Dispatch<React.SetStateAction<OpenApiSpec | null>>;

  setControllers: React.Dispatch<React.SetStateAction<ParsedController[]>>;

  setGroups: React.Dispatch<React.SetStateAction<ControllerGroup[]>>;

  setUrl: React.Dispatch<React.SetStateAction<string>>;

  setSearch: React.Dispatch<React.SetStateAction<string>>;

  setExpandedControllers: React.Dispatch<React.SetStateAction<Set<string>>>;

  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;

  setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>;

  setNewGroupName: React.Dispatch<React.SetStateAction<string>>;

  setNewGroupTags: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function useImportActions({
  url,

  controllers,

  groups,

  setStep,

  setState,

  setError,

  setSpec,

  setControllers,

  setGroups,

  setUrl,

  setSearch,

  setExpandedControllers,

  setExpandedGroups,

  setCreatingGroup,

  setNewGroupName,

  setNewGroupTags,
}: Props) {
  const [importedCount, setImportedCount] = useState(0);

  async function fetchSwagger() {
    setState("loading");

    setError(null);

    const result = await fetchSwaggerSpec(url);

    if (!result.spec) {
      setError(result.error ?? "Swagger پیدا نشد");

      setState("error");

      return;
    }

    const parsed = parseControllers(result.spec);

    setSpec(result.spec);

    setControllers(parsed);

    setStep("select");

    setState("parsed");
  }

  async function importDocs() {
    /**
     * اینجا بعدا importDocsAction صدا زده میشه
     */

    setImportedCount(controllers.length);

    setStep("result");
  }

  function reset() {
    setStep("url");

    setState("idle");

    setError(null);

    setUrl("");

    setSpec(null);

    setControllers([]);

    setGroups([]);

    setSearch("");

    setExpandedControllers(new Set());

    setExpandedGroups(new Set());

    setCreatingGroup(false);

    setNewGroupName("");

    setNewGroupTags(new Set());

    setImportedCount(0);
  }

  const endpointCount = controllers.reduce(
    (sum, controller) =>
      sum + controller.endpoints.filter((endpoint) => endpoint.selected).length,
    0,
  );

  return {
    fetchSwagger,

    importDocs,

    reset,

    importedCount,

    endpointCount,

    groupCount: groups.length,
  };
}
