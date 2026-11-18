import { RestrictionNavLink } from "@/src/features/lister-dashboard/ui/RestrictionNavLink";
import { DashboardShell } from "@/src/shared/dashboard/DashboardShell";
import { ProtectedRoute } from "@/src/shared/routes/ProtectedRoute";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedAccessTypes={["LISTER"]}>
      <DashboardShell role="lister" sidebarExtra={<RestrictionNavLink />}>
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
