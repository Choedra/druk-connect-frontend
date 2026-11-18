import { DashboardShell } from "@/src/shared/dashboard/DashboardShell";
import { ProtectedRoute } from "@/src/shared/routes/ProtectedRoute";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <DashboardShell role="admin">
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
