/**
 * Centralized user-facing copy.
 */
import { ASQUARIFY, DEMO_LOGINS } from "./company";

export const APP = {
  name: ASQUARIFY.displayName,
  tagline: ASQUARIFY.tagline,
};

export const AUTH = {
  welcome: `Welcome to ${ASQUARIFY.displayName}`,
  subtitle: `${ASQUARIFY.headquarters} · Est. ${ASQUARIFY.founded}`,
  email: "Work email",
  password: "Password",
  signIn: "Sign in",
  selectRole: "Continue as",
  employee: "Employee",
  admin: "Admin",
  demoHint: `Employee: ${DEMO_LOGINS.employee} · Admin: ${DEMO_LOGINS.admin} · Password: ${DEMO_LOGINS.password}`,
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
