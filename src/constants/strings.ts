/**
 * Centralized user-facing copy. Keeps screens free of hardcoded labels so
 * they can be re-skinned, translated, or refactored without touching UI.
 */

export const APP = {
  name: "HRMS",
  tagline: "Human Resource Management System",
};

export const AUTH = {
  welcome: "Welcome back",
  subtitle: "Sign in to continue to your workspace",
  email: "Work email",
  password: "Password",
  signIn: "Sign in",
  selectRole: "Continue as",
  employee: "Employee",
  admin: "Admin",
  demoHint: "Employee: aarav.mehta@organiq.co · Admin: admin@organiq.co · Password: demo123",
  forgotPassword: "Forgot password?",
};

export const COMMON = {
  seeAll: "See all",
  viewAll: "View all",
  approve: "Approve",
  reject: "Reject",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  today: "Today",
  thisMonth: "This month",
  thisWeek: "This week",
  search: "Search",
};

export const EMPLOYEE_NAV = {
  home: "Home",
  attendance: "Attendance",
  leave: "Leave",
  payslip: "Payslips",
  profile: "Profile",
};

export const ADMIN_NAV = {
  overview: "Overview",
  people: "People",
  requests: "Requests",
  payroll: "Payroll",
  settings: "Settings",
};
