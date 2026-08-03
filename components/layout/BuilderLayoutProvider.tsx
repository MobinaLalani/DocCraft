"use client";

import BuilderLayout from "./BuilderLayout";

import { DocsBuilderProvider } from "@/features/docs-builder/context/DocsBuilderContext";

import type { DocsWorkspace } from "@/lib/docs/workspace";
import type { AuthSession } from "@/lib/auth/types";

type Props = {
  children: React.ReactNode;
  session: AuthSession;
  workspace: DocsWorkspace;
};

export default function BuilderLayoutProvider({
  children,
  session,
  workspace,
}: Props) {
  return (
    <DocsBuilderProvider initialWorkspace={workspace}>
      <BuilderLayout session={session}>{children}</BuilderLayout>
    </DocsBuilderProvider>
  );
}
