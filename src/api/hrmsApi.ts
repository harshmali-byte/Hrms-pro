import type {
  Announcement,
  AttendanceRecord,
  DashboardCharts,
  DepartmentStat,
  Employee,
  Holiday,
  HrmsNotification,
  LeaveBalance,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  PayrollSummary,
  Payslip,
} from "@/types";
import type { AttendanceSegment } from "@/utils/attendance";
import { apiFetch } from "./client";

export interface AttendancePersist {
  dateKey: string;
  segments: AttendanceSegment[];
}

export interface DemoPersist {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  notifications: HrmsNotification[];
}

export interface PayrollStep {
  label: string;
  done: boolean;
}

export interface PayrollPersist {
  steps: PayrollStep[];
  runStatus: "In progress" | "Locked";
}

export interface DashboardStats {
  totalEmployees: number;
  newJoiners: number;
  onLeave: number;
  activeEmployees: number;
  pendingRequests: number;
  trends: {
    totalEmployees: { text: string; positive: boolean };
    newJoiners: { text: string; positive: boolean };
    onLeave: { text: string; positive: boolean };
    activeEmployees: { text: string; positive: boolean };
  };
}

export interface AuthLoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "employee" | "admin";
    employeeId: string | null;
  };
}

export interface BootstrapState {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  notifications: HrmsNotification[];
  payroll: PayrollPersist;
  attendance: AttendancePersist;
  payslips: Payslip[];
  announcements: Announcement[];
  holidays: Holiday[];
  currentEmployeeId: string | null;
  role?: "employee" | "admin";
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthLoginResult> {
  return apiFetch<AuthLoginResult>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutApi(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function fetchMeApi(): Promise<{ user: AuthLoginResult["user"] }> {
  return apiFetch("/auth/me");
}

export async function fetchBootstrap(): Promise<BootstrapState> {
  return apiFetch<BootstrapState>("/bootstrap/state");
}

export async function fetchAttendanceHistory(days = 14): Promise<AttendanceRecord[]> {
  return apiFetch<AttendanceRecord[]>(`/attendance/history?days=${days}`);
}

export async function saveAttendance(data: AttendancePersist): Promise<void> {
  await apiFetch("/attendance/today", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function clockInApi(): Promise<AttendancePersist> {
  return apiFetch<AttendancePersist>("/attendance/clock-in", { method: "POST" });
}

export async function clockOutApi(): Promise<AttendancePersist> {
  return apiFetch<AttendancePersist>("/attendance/clock-out", { method: "POST" });
}

export async function resetAllData(): Promise<void> {
  await apiFetch("/admin/reset-demo", { method: "POST" });
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/dashboard/stats");
}

export async function fetchDashboardCharts(): Promise<DashboardCharts> {
  return apiFetch<DashboardCharts>("/dashboard/charts");
}

export async function fetchDepartments(): Promise<DepartmentStat[]> {
  return apiFetch<DepartmentStat[]>("/employees/departments");
}

export async function fetchPayrollSummary(): Promise<PayrollSummary> {
  return apiFetch<PayrollSummary>("/payroll/summary");
}

export function computeDashboardStats(
  employees: Employee[],
  leaveRequests: LeaveRequest[],
): DashboardStats {
  const total = employees.length;
  const onLeave = employees.filter((e) => e.status === "onLeave").length;
  const active = employees.filter((e) => e.status === "active").length;
  const probation = employees.filter((e) => e.status === "probation").length;
  const newJoiners = Math.max(1, Math.floor(total * 0.026));
  const pending = leaveRequests.filter((r) => r.status === "pending").length;

  return {
    totalEmployees: total,
    newJoiners,
    onLeave,
    activeEmployees: active + probation,
    pendingRequests: pending,
    trends: {
      totalEmployees: { text: "+12.5% from last month", positive: true },
      newJoiners: { text: "+3.3% from last month", positive: true },
      onLeave: { text: "-5.2% from last month", positive: false },
      activeEmployees: { text: "+10.1% from last month", positive: true },
    },
  };
}

export async function submitLeaveRequest(input: {
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
}): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>("/leave/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function cancelLeaveRequest(id: string): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>(`/leave/requests/${id}/cancel`, { method: "POST" });
}

export async function updateLeaveStatus(
  id: string,
  status: LeaveStatus,
): Promise<{ request: LeaveRequest; leaveBalances: LeaveBalance[] }> {
  return apiFetch(`/leave/requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function addEmployee(input: {
  name: string;
  email: string;
  role: string;
  department: string;
}): Promise<Employee> {
  return apiFetch<Employee>("/employees", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getPayslipsFromApi(): Promise<Payslip[]> {
  return apiFetch<Payslip[]>("/payroll/payslips");
}

export async function advancePayrollStep(): Promise<PayrollPersist> {
  return apiFetch<PayrollPersist>("/payroll/advance", { method: "POST" });
}

export async function markNotificationReadApi(id: string): Promise<void> {
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsReadApi(): Promise<void> {
  await apiFetch("/notifications/read-all", { method: "PATCH" });
}
