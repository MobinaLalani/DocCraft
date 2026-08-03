"use client";

import { BuilderCenterPanel } from "@/features/docs-builder/components/BuilderCenterPanel";

import BuilderLayout from "@/components/layout/BuilderLayout";

import { ToolsPanelContent } from "@/components/layout/sidebars";

import { DocsBuilderProvider } from "@/features/docs-builder/context/DocsBuilderContext";

import type { AuthSession } from "@/lib/auth/types";
import type { DocsWorkspace } from "@/lib/docs/workspace";

type DocsBuilderDemoProps = {
  initialWorkspace: DocsWorkspace;
  session: AuthSession;
};

export function DocsBuilderDemo({
  initialWorkspace,
  session,
}: DocsBuilderDemoProps) {
  return (
    <DocsBuilderProvider initialWorkspace={initialWorkspace}>
      <BuilderLayout session={session}>
        <p
          className="
          font-bold
          text-2xl
          mr-6
          mb-4
        "
        >
          پیش نمایش صفحه
        </p>

        <div
          className="
            border
            border-(--darkBlue)
            p-3
            rounded-3xl
            mb-6
            bg-white
          "
        >
          <BuilderCenterPanel />
        </div>
      </BuilderLayout>
    </DocsBuilderProvider>
  );
}
