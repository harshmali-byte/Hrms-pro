import type {
  Announcement,
  AttendanceRecord,
  Employee,
  Holiday,
  LeaveBalance,
  LeaveRequest,
  Payslip,
} from "@/types";

/** Fallback when API is offline — mirrors Asquarify seed. */
export const currentUser = {
  id: "EMP-0006",
  name: "Harsh Mali",
  role: "Full Stack Developer",
  department: "Engineering",
  email: "harsh.mali@asquarify.co",
  phone: "+91 98765 10006",
  joinedOn: "10 Feb 2026",
  manager: "Aftab Alam",
  avatarColor: "#2563EB",
  employeeCode: "ASQ-0006",
  location: "Junagadh, Gujarat, IN",
};

export const employees: Employee[] = [
  { id: "EMP-0001", name: "Bhargav Purohit", role: "CEO & Founder", department: "Leadership", email: "bhargav.purohit@asquarify.co", phone: "+91 98765 10001", avatarColor: "#0066FF", joinedOn: "01 Jan 2026", status: "active", employeeCode: "ASQ-0001", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0002", name: "Aftab Alam", role: "CTO & Founder", department: "Leadership", email: "aftab.alam@asquarify.co", phone: "+91 98765 10002", avatarColor: "#8B5CF6", joinedOn: "01 Jan 2026", status: "active", employeeCode: "ASQ-0002", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0003", name: "Pranav Visavadia", role: "Full Stack Developer", department: "Engineering", email: "pranav.visavadia@asquarify.co", phone: "+91 98765 10003", avatarColor: "#0EA5E9", joinedOn: "15 Jan 2026", status: "active", employeeCode: "ASQ-0003", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0004", name: "Savan Vagadiya", role: "Full Stack Developer", department: "Engineering", email: "savan.vagadiya@asquarify.co", phone: "+91 98765 10004", avatarColor: "#10B981", joinedOn: "20 Jan 2026", status: "active", employeeCode: "ASQ-0004", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0005", name: "Shubham Bhatt", role: "Media & Content Creator", department: "Creative", email: "shubham.bhatt@asquarify.co", phone: "+91 98765 10005", avatarColor: "#F59E0B", joinedOn: "01 Feb 2026", status: "active", employeeCode: "ASQ-0005", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0006", name: "Harsh Mali", role: "Full Stack Developer", department: "Engineering", email: "harsh.mali@asquarify.co", phone: "+91 98765 10006", avatarColor: "#2563EB", joinedOn: "10 Feb 2026", status: "active", employeeCode: "ASQ-0006", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0007", name: "Monil Thakrar", role: "Backend Engineer", department: "Engineering", email: "monil.thakrar@asquarify.co", phone: "+91 98765 10007", avatarColor: "#EC4899", joinedOn: "18 Feb 2026", status: "active", employeeCode: "ASQ-0007", location: "Junagadh, Gujarat, IN" },
  { id: "EMP-0008", name: "Balveer Singh Rathore", role: "Senior Developer", department: "Engineering", email: "balveer.rathore@asquarify.co", phone: "+91 98765 10008", avatarColor: "#14B8A6", joinedOn: "05 Jan 2026", status: "active", employeeCode: "ASQ-0008", location: "Junagadh, Gujarat, IN" },
];

export const leaveBalances: LeaveBalance[] = [
  { type: "casual", total: 12, used: 2 },
  { type: "sick", total: 10, used: 1 },
  { type: "earned", total: 18, used: 3 },
  { type: "unpaid", total: 0, used: 0 },
];

export const myLeaveRequests: LeaveRequest[] = [
  { id: "LR-3001", employeeId: "EMP-0006", employeeName: "Harsh Mali", type: "casual", from: "12 May 2026", to: "12 May 2026", days: 1, reason: "Personal work in Junagadh", status: "approved", appliedOn: "08 May 2026" },
  { id: "LR-3002", employeeId: "EMP-0006", employeeName: "Harsh Mali", type: "sick", from: "22 Apr 2026", to: "22 Apr 2026", days: 1, reason: "Rest day", status: "approved", appliedOn: "21 Apr 2026" },
  { id: "LR-3003", employeeId: "EMP-0006", employeeName: "Harsh Mali", type: "earned", from: "10 Jun 2026", to: "12 Jun 2026", days: 3, reason: "Short break before Ne Family release", status: "pending", appliedOn: "10 May 2026" },
];

export const pendingLeaveRequests: LeaveRequest[] = [
  { id: "LR-3003", employeeId: "EMP-0006", employeeName: "Harsh Mali", type: "earned", from: "10 Jun 2026", to: "12 Jun 2026", days: 3, reason: "Short break before Ne Family release", status: "pending", appliedOn: "10 May 2026" },
  { id: "LR-3004", employeeId: "EMP-0007", employeeName: "Monil Thakrar", type: "casual", from: "18 May 2026", to: "18 May 2026", days: 1, reason: "Family function", status: "pending", appliedOn: "15 May 2026" },
  { id: "LR-3005", employeeId: "EMP-0004", employeeName: "Savan Vagadiya", type: "earned", from: "25 May 2026", to: "27 May 2026", days: 3, reason: "Travel", status: "pending", appliedOn: "14 May 2026" },
  { id: "LR-3006", employeeId: "EMP-0005", employeeName: "Shubham Bhatt", type: "casual", from: "20 May 2026", to: "20 May 2026", days: 1, reason: "Bakali campaign shoot", status: "pending", appliedOn: "13 May 2026" },
];

export const recentAttendance: AttendanceRecord[] = [
  { date: "15 May", checkIn: "09:18", checkOut: "18:42", hours: 9.2, status: "present" },
  { date: "14 May", checkIn: "09:22", checkOut: "19:05", hours: 9.5, status: "present" },
  { date: "13 May", checkIn: "09:35", checkOut: "18:30", hours: 8.9, status: "present" },
  { date: "12 May", status: "leave" },
  { date: "11 May", status: "weekend" },
  { date: "10 May", status: "weekend" },
  { date: "09 May", checkIn: "09:15", checkOut: "18:20", hours: 9.1, status: "present" },
];

export const payslips: Payslip[] = [
  { id: "PS-2604", month: "April", year: 2026, gross: 85000, deductions: 8500, net: 76500, status: "paid" },
  { id: "PS-2603", month: "March", year: 2026, gross: 85000, deductions: 8500, net: 76500, status: "paid" },
  { id: "PS-2602", month: "February", year: 2026, gross: 80000, deductions: 8000, net: 72000, status: "paid" },
  { id: "PS-2605", month: "May", year: 2026, gross: 85000, deductions: 8500, net: 76500, status: "processing" },
];

export const announcements: Announcement[] = [
  { id: "AN-101", title: "Ne Family — UK insurance go-live prep", body: "Engineering freeze starts 28 May. QA sign-off on claims flow is the top priority.", postedBy: "Aftab Alam", postedOn: "15 May 2026", tag: "project" },
  { id: "AN-102", title: "Bakali mango season is live", body: "Fresh inventory is up on the shop. Campaign assets drop this week.", postedBy: "Bhargav Purohit", postedOn: "14 May 2026", tag: "celebration" },
  { id: "AN-103", title: "Welcome to Junagadh HQ · 2026", body: "Asquarify — automation-first delivery from Gujarat.", postedBy: "Bhargav Purohit", postedOn: "01 Jan 2026", tag: "policy" },
];

export const holidays: Holiday[] = [
  { id: "H-01", date: "26 Jan 2026", name: "Republic Day", type: "public" },
  { id: "H-02", date: "14 Mar 2026", name: "Dhuleti", type: "optional" },
  { id: "H-03", date: "15 Aug 2026", name: "Independence Day", type: "public" },
  { id: "H-04", date: "02 Oct 2026", name: "Gandhi Jayanti", type: "public" },
];

export const adminStats = {
  totalEmployees: 8,
  presentToday: 7,
  onLeave: 0,
  newHires: 6,
  pendingRequests: pendingLeaveRequests.length,
  openRoles: 2,
};

export const departments = [
  { name: "Engineering", headcount: 5, color: "#0066FF" },
  { name: "Leadership", headcount: 2, color: "#8B5CF6" },
  { name: "Creative", headcount: 1, color: "#F59E0B" },
];
