import { connection } from "next/server";
import BuilderLayoutProvider from "@/components/layout/BuilderLayoutProvider";
import AdminShell from "@/components/layout/AdminShell";
import { requireRole } from "@/lib/auth/server";
import { getStoredWorkspace } from "@/lib/docs/workspace-service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  const session = await requireRole("admin");

  const workspace = await getStoredWorkspace();

  return (
    <BuilderLayoutProvider session={session} workspace={workspace}>
      {children}
    </BuilderLayoutProvider>
  );
}