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
  section?: string;
  badge?: number;
}

export const adminNavItems: ShellNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "General" },
  { id: "people", label: "Personnel", icon: Users, section: "General" },
  { id: "requests", label: "Leave Management", icon: Inbox, section: "General" },
  { id: "payroll", label: "Compensation", icon: Wallet, section: "General" },
  { id: "settings", label: "Configuration", icon: Settings, section: "Workspace" },
];

export const employeeNavItems: ShellNavItem[] = [
  { id: "home", label: "Dashboard", icon: Home, section: "General" },
  { id: "attendance", label: "Attendance", icon: CalendarCheck, section: "General" },
  { id: "leave", label: "Leave Management", icon: Plane, section: "General" },
  { id: "payslip", label: "Compensation", icon: FileText, section: "General" },
  { id: "profile", label: "My Profile", icon: User, section: "Account" },
];

export const adminPageTitles: Record<AdminRouteId, string> = {
  dashboard: "Dashboard",
  people: "Personnel",
  requests: "Leave Management",
  payroll: "Compensation",
  settings: "Configuration",
};

export const adminPageSubtitles: Record<AdminRouteId, string> = {
  dashboard: "Overview of your organization at a glance.",
  people: "Manage employee records, departments, and profiles.",
  requests: "Review and approve team leave requests.",
  payroll: "Payroll runs, payslips, and compensation insights.",
  settings: "Policies, roles, templates, and workspace preferences.",
};

export const employeePageTitles: Record<EmployeeRouteId, string> = {
  home: "Dashboard",
  attendance: "Attendance",
  leave: "Leave Management",
  payslip: "Compensation",
  profile: "My Profile",
};

export const employeePageSubtitles: Record<EmployeeRouteId, string> = {
  home: "Your schedule, balances, and quick actions.",
  attendance: "Clock-in history and monthly attendance.",
  leave: "Request time off and track balances.",
  payslip: "View and download your payslips.",
  profile: "Personal details and account settings.",
};
