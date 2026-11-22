import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";

interface AdminPageProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

async function AdminPageContent({ title, description, actions, children }: AdminPageProps) {
  await connection();
  const admin = await requireAdmin();

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <EnterpriseShell user={{ name: admin.name, role: admin.role }} onLogout={handleLogout}>
      <ErpPageTemplate hideBreadcrumb title={title} description={description} actions={actions}>
        {children}
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

/** Auth-guarded admin page: shell, sidebar, page header, and the page body. */
export function AdminPage(props: AdminPageProps) {
  return (
    <Suspense fallback={<LoadingState label={`Memuat ${props.title.toLowerCase()}...`} rows={6} />}>
      <AdminPageContent {...props} />
    </Suspense>
  );
}
