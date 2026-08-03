"use client";

import { useState } from "react";

import type {
  ControllerGroup,
  ImportState,
  OpenApiSpec,
  ParsedController,
  SwaggerStep,
} from "../model";

export function useSwaggerImport() {
  const [step, setStep] = useState<SwaggerStep>("url");

  const [state, setState] = useState<ImportState>("idle");

  const [url, setUrl] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [spec, setSpec] = useState<OpenApiSpec | null>(null);

  const [controllers, setControllers] = useState<ParsedController[]>([]);

  const [groups, setGroups] = useState<ControllerGroup[]>([]);

  const [search, setSearch] = useState("");

  const [expandedControllers, setExpandedControllers] = useState<Set<string>>(
    new Set(),
  );

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const [creatingGroup, setCreatingGroup] = useState(false);

  const [newGroupName, setNewGroupName] = useState("");

  const [newGroupTags, setNewGroupTags] = useState<Set<string>>(new Set());

  return {
    step,
    setStep,

    state,
    setState,

    url,
    setUrl,

    error,
    setError,

    spec,
    setSpec,

    controllers,
    setControllers,

    groups,
    setGroups,

    search,
    setSearch,

    expandedControllers,
    setExpandedControllers,

    expandedGroups,
    setExpandedGroups,

    creatingGroup,
    setCreatingGroup,

    newGroupName,
    setNewGroupName,

    newGroupTags,
    setNewGroupTags,
  };
}
