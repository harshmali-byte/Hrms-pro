import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHrmsData } from "@/context/HrmsDataContext";
import { EmployeeNavProvider } from "@/context/EmployeeNavContext";
import { AppShell } from "@/components/layout/AppShell";
import {
  employeeNavItems,
  employeePageSubtitles,
  employeePageTitles,
  type EmployeeRouteId,
} from "./shellNav";

import { EmployeeDashboard } from "@/screens/employee/EmployeeDashboard";
import { AttendanceScreen } from "@/screens/employee/AttendanceScreen";
import { LeaveScreen } from "@/screens/employee/LeaveScreen";
import { PayslipScreen } from "@/screens/employee/PayslipScreen";
import { ProfileScreen } from "@/screens/employee/ProfileScreen";

function EmployeeScreen({
  route,
  setRoute,
}: {
  route: EmployeeRouteId;
  setRoute: (r: EmployeeRouteId) => void;
}) {
  switch (route) {
    case "home":
      return <EmployeeDashboard embedded />;
    case "attendance":
      return <AttendanceScreen embedded />;
    case "leave":
      return <LeaveScreen embedded />;
    case "payslip":
      return <PayslipScreen embedded />;
    case "profile":
      return <ProfileScreen embedded routeKey={route} />;
    default:
      return <EmployeeDashboard embedded />;
  }
}

function EmployeeShell() {
  const { signOut, user } = useAuth();
  const { currentEmployee, unreadNotificationCount } = useHrmsData();
  const [route, setRoute] = useState<EmployeeRouteId>("home");

  const navItems = useMemo(
    () =>
      employeeNavItems.map((item) =>
        item.id === "home" && unreadNotificationCount > 0
          ? { ...item, badge: unreadNotificationCount }
          : item,
      ),
    [unreadNotificationCount],
  );

  return (
    <EmployeeNavProvider onRouteChange={setRoute}>
      <AppShell
        navItems={navItems}
        activeId={route}
        onNavigate={(id) => setRoute(id as EmployeeRouteId)}
        pageTitle={employeePageTitles[route]}
        pageSubtitle={employeePageSubtitles[route]}
        userName={currentEmployee?.name ?? user?.name ?? "Employee"}
        userRole="Employee"
        avatarColor={currentEmployee?.avatarColor ?? "#0066FF"}
        onSignOut={() => void signOut()}
      >
        <EmployeeScreen route={route} setRoute={setRoute} />
      </AppShell>
    </EmployeeNavProvider>
  );
}

export function EmployeeTabs() {
  return <EmployeeShell />;
}
