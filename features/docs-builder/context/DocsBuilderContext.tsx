"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useDocsBuilder } from "../model";
import type { DocsWorkspace } from "@/lib/docs/workspace";

type DocsBuilderContextType = ReturnType<typeof useDocsBuilder>;

const DocsBuilderContext = createContext<DocsBuilderContextType | null>(null);

type DocsBuilderProviderProps = {
  children: ReactNode;
  initialWorkspace: DocsWorkspace;
};

export function DocsBuilderProvider({
  children,
  initialWorkspace,
}: DocsBuilderProviderProps) {
  const builder = useDocsBuilder(initialWorkspace);

  return (
    <DocsBuilderContext.Provider value={builder}>
      {children}
    </DocsBuilderContext.Provider>
  );
}

export function useDocsBuilderContext() {
  const context = useContext(DocsBuilderContext);

  if (!context) {
    throw new Error(
      "useDocsBuilderContext must be used inside DocsBuilderProvider",
    );
  }

  return context;
}
