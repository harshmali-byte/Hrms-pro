import type { LucideIcon } from "lucide-react-native";
import {
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  Home,
  CalendarCheck,
  Plane,
  User,
} from "lucide-react-native";

export type AdminRouteId =
  | "dashboard"
  | "people"
  | "requests"
  | "payroll"
  | "settings";

export type EmployeeRouteId =
  | "home"
  | "attendance"
  | "leave"
  | "payslip"
  | "profile";

export interface ShellNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  children?: { id: string; label: string }[];
}

export const adminNavItems: ShellNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { id: "dashboard", label: "Summary" },
      { id: "dashboard", label: "Analytics" },
    ],
  },
  { id: "people", label: "Personnel", icon: Users },
  { id: "requests", label: "Leave Management", icon: Inbox },
  { id: "payroll", label: "Compensation", icon: Wallet },
  { id: "settings", label: "Configuration", icon: Settings },
];

export const employeeNavItems: ShellNavItem[] = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "leave", label: "Leave Management", icon: Plane },
  { id: "payslip", label: "Compensation", icon: FileText },
  { id: "profile", label: "My Profile", icon: User },
];

export const adminPageTitles: Record<AdminRouteId, string> = {
  dashboard: "Dashboard",
  people: "Personnel",
  requests: "Leave Management",
  payroll: "Compensation",
  settings: "Configuration",
};

export const employeePageTitles: Record<EmployeeRouteId, string> = {
  home: "Dashboard",
  attendance: "Attendance",
  leave: "Leave Management",
  payslip: "Compensation",
  profile: "My Profile",
};
