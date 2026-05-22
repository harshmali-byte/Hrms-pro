import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHrmsData } from "@/context/HrmsDataContext";
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
      return <EmployeeDashboard embedded onNavigate={setRoute} />;
    case "attendance":
      return <AttendanceScreen embedded />;
    case "leave":
      return <LeaveScreen embedded />;
    case "payslip":
      return <PayslipScreen embedded />;
    case "profile":
      return <ProfileScreen embedded />;
    default:
      return <EmployeeDashboard embedded />;
  }
}

export function EmployeeTabs() {
  const { signOut, user } = useAuth();
  const { currentEmployee } = useHrmsData();
  const [route, setRoute] = useState<EmployeeRouteId>("home");

  return (
    <AppShell
      navItems={employeeNavItems}
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
  );
}
