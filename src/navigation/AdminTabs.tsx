import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHrmsData } from "@/context/HrmsDataContext";
import { AdminNavProvider } from "@/context/AdminNavContext";
import { AppShell } from "@/components/layout/AppShell";
import {
  adminNavItems,
  adminPageSubtitles,
  adminPageTitles,
  type AdminRouteId,
} from "./shellNav";

import { AdminDashboard } from "@/screens/admin/AdminDashboard";
import { EmployeesScreen } from "@/screens/admin/EmployeesScreen";
import { LeaveRequestsScreen } from "@/screens/admin/LeaveRequestsScreen";
import { PayrollScreen } from "@/screens/admin/PayrollScreen";
import { AdminSettingsScreen } from "@/screens/admin/AdminSettingsScreen";

function AdminScreen({ route }: { route: AdminRouteId }) {
  switch (route) {
    case "dashboard":
      return <AdminDashboard />;
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
  const { pendingLeaveCount } = useHrmsData();
  const [route, setRoute] = useState<AdminRouteId>("dashboard");

  const navItems = useMemo(
    () =>
      adminNavItems.map((item) =>
        item.id === "requests" && pendingLeaveCount > 0
          ? { ...item, badge: pendingLeaveCount }
          : item,
      ),
    [pendingLeaveCount],
  );

  return (
    <AdminNavProvider onRouteChange={setRoute}>
      <AppShell
        navItems={navItems}
        activeId={route}
        onNavigate={(id) => setRoute(id as AdminRouteId)}
        pageTitle={adminPageTitles[route]}
        pageSubtitle={adminPageSubtitles[route]}
        userName={user?.name ?? "Admin"}
        userRole="Admin"
        avatarColor="#0066FF"
        onSignOut={() => void signOut()}
      >
        <AdminScreen route={route} />
      </AppShell>
    </AdminNavProvider>
  );
}
