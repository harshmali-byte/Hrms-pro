import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import {
  adminNavItems,
  adminPageTitles,
  type AdminRouteId,
} from "./shellNav";

import { AdminDashboard } from "@/screens/admin/AdminDashboard";
import { EmployeesScreen } from "@/screens/admin/EmployeesScreen";
import { LeaveRequestsScreen } from "@/screens/admin/LeaveRequestsScreen";
import { PayrollScreen } from "@/screens/admin/PayrollScreen";
import { AdminSettingsScreen } from "@/screens/admin/AdminSettingsScreen";

function AdminScreen({
  route,
  setRoute,
}: {
  route: AdminRouteId;
  setRoute: (r: AdminRouteId) => void;
}) {
  switch (route) {
    case "dashboard":
      return (
        <AdminDashboard
          onNavigatePeople={() => setRoute("people")}
          onNavigateRequests={() => setRoute("requests")}
        />
      );
    case "people":
      return <EmployeesScreen embedded />;
    case "requests":
      return <LeaveRequestsScreen embedded />;
    case "payroll":
      return <PayrollScreen embedded />;
    case "settings":
      return <AdminSettingsScreen embedded />;
    default:
      return <AdminDashboard />;
  }
}

export function AdminTabs() {
  const { signOut, user } = useAuth();
  const [route, setRoute] = useState<AdminRouteId>("dashboard");

  return (
    <AppShell
      navItems={adminNavItems}
      activeId={route}
      onNavigate={(id) => setRoute(id as AdminRouteId)}
      pageTitle={adminPageTitles[route]}
      userName={user?.name ?? "Admin"}
      userRole="Admin"
      avatarColor="#4F6BED"
      onSignOut={() => void signOut()}
    >
      <AdminScreen route={route} setRoute={setRoute} />
    </AppShell>
  );
}
