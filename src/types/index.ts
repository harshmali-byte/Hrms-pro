export type Role = "employee" | "admin";

export type LeaveStatus = "pending" | "approved" | "rejected";
export type LeaveType = "casual" | "sick" | "earned" | "unpaid";

export type AttendanceStatus = "present" | "absent" | "leave" | "weekend" | "holiday";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatarColor: string;
  joinedOn: string;
  reportsTo?: string;
  status: "active" | "onLeave" | "probation";
  location?: string;
  employeeCode?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface AttendanceRecord {
  date: string;
  dateKey?: string;
  checkIn?: string;
  checkOut?: string;
  hours?: number;
  status: AttendanceStatus;
}

export interface DashboardCharts {
  departmentEngagement: { label: string; value: number; color: string }[];
  upcomingEvents: { id: string; title: string; when: string; description?: string }[];
  noticeBoard: { id: string; title: string; date: string; description?: string }[];
  attendanceTrend?: {
    labels: string[];
    present: number[];
    absent: number[];
  };
}

export interface DepartmentStat {
  name: string;
  headcount: number;
  color: string;
}

export interface PayrollSummary {
  activeEmployees: number;
  avgSalaryPerHead: number;
  estimatedMonthlyOutflow: number;
}

export interface Payslip {
  id: string;
  month: string;
  year: number;
  gross: number;
  deductions: number;
  net: number;
  status: "paid" | "processing";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  postedBy: string;
  postedOn: string;
  tag: "policy" | "event" | "celebration" | "general" | "project";
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: "public" | "optional";
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
}

/** In-app notification (demo — no push). */
export interface HrmsNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export type EmployeeDocumentCategory =
  | "identity"
  | "employment"
  | "payroll"
  | "education"
  | "other";

export interface EmployeeDocument {
  id: string;
  title: string;
  category: EmployeeDocumentCategory;
  fileUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyPreferences {
  profileVisibility: "team" | "managers" | "private";
  shareBirthday: boolean;
  sharePhone: boolean;
  twoFactorEnabled: boolean;
}

export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high";

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface AccountSettings {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  compactMode: boolean;
}

export interface AccountOverview {
  employee: Employee;
  documents: EmployeeDocument[];
  privacy: PrivacyPreferences;
  supportTickets: SupportTicket[];
  settings: AccountSettings;
}
