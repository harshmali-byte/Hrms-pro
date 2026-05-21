import type {
  Announcement,
  AttendanceRecord,
  Employee,
  Holiday,
  LeaveBalance,
  LeaveRequest,
  Payslip,
} from "@/types";

export const currentUser = {
  id: "EMP-1042",
  name: "Aarav Mehta",
  role: "Senior Product Designer",
  department: "Design",
  email: "aarav.mehta@organiq.co",
  phone: "+91 98765 43210",
  joinedOn: "12 Mar 2022",
  manager: "Priya Sharma",
  avatarColor: "#4F46E5",
  employeeCode: "ORG-1042",
  location: "Bengaluru, IN",
};

export const employees: Employee[] = [
  { id: "EMP-1001", name: "Priya Sharma",   role: "Engineering Manager",     department: "Engineering", email: "priya@organiq.co",   phone: "+91 90000 11001", avatarColor: "#4F46E5", joinedOn: "04 Jan 2020", status: "active" },
  { id: "EMP-1002", name: "Rohan Iyer",     role: "Senior Backend Engineer", department: "Engineering", email: "rohan@organiq.co",   phone: "+91 90000 11002", avatarColor: "#0EA5E9", joinedOn: "16 Aug 2021", status: "active" },
  { id: "EMP-1003", name: "Neha Kapoor",    role: "Talent Partner",          department: "People",      email: "neha@organiq.co",    phone: "+91 90000 11003", avatarColor: "#10B981", joinedOn: "02 Feb 2023", status: "active" },
  { id: "EMP-1004", name: "Karan Patel",    role: "Finance Lead",            department: "Finance",     email: "karan@organiq.co",   phone: "+91 90000 11004", avatarColor: "#F59E0B", joinedOn: "11 Nov 2019", status: "onLeave" },
  { id: "EMP-1005", name: "Ishita Verma",   role: "Marketing Specialist",    department: "Marketing",   email: "ishita@organiq.co",  phone: "+91 90000 11005", avatarColor: "#EF4444", joinedOn: "27 May 2022", status: "active" },
  { id: "EMP-1006", name: "Devansh Rao",    role: "QA Engineer",             department: "Engineering", email: "devansh@organiq.co", phone: "+91 90000 11006", avatarColor: "#8B5CF6", joinedOn: "19 Sep 2023", status: "probation" },
  { id: "EMP-1042", name: "Aarav Mehta",    role: "Senior Product Designer", department: "Design",      email: "aarav.mehta@organiq.co", phone: "+91 98765 43210", avatarColor: "#4F46E5", joinedOn: "12 Mar 2022", status: "active" },
];

export const leaveBalances: LeaveBalance[] = [
  { type: "casual",  total: 12, used: 4 },
  { type: "sick",    total: 10, used: 2 },
  { type: "earned",  total: 18, used: 6 },
  { type: "unpaid",  total: 0,  used: 0 },
];

export const myLeaveRequests: LeaveRequest[] = [
  { id: "LR-2041", employeeId: "EMP-1042", employeeName: "Aarav Mehta", type: "casual", from: "12 May 2026", to: "12 May 2026", days: 1, reason: "Personal errand",        status: "approved", appliedOn: "08 May 2026" },
  { id: "LR-2038", employeeId: "EMP-1042", employeeName: "Aarav Mehta", type: "sick",   from: "21 Apr 2026", to: "22 Apr 2026", days: 2, reason: "Fever and rest",         status: "approved", appliedOn: "21 Apr 2026" },
  { id: "LR-2032", employeeId: "EMP-1042", employeeName: "Aarav Mehta", type: "earned", from: "02 Jun 2026", to: "06 Jun 2026", days: 5, reason: "Family trip to Coorg",    status: "pending",  appliedOn: "10 May 2026" },
];

export const pendingLeaveRequests: LeaveRequest[] = [
  { id: "LR-2032", employeeId: "EMP-1042", employeeName: "Aarav Mehta",  type: "earned", from: "02 Jun 2026", to: "06 Jun 2026", days: 5, reason: "Family trip",            status: "pending", appliedOn: "10 May 2026" },
  { id: "LR-2051", employeeId: "EMP-1002", employeeName: "Rohan Iyer",   type: "sick",   from: "16 May 2026", to: "17 May 2026", days: 2, reason: "Migraine",               status: "pending", appliedOn: "15 May 2026" },
  { id: "LR-2052", employeeId: "EMP-1005", employeeName: "Ishita Verma", type: "casual", from: "20 May 2026", to: "20 May 2026", days: 1, reason: "Apartment registration", status: "pending", appliedOn: "14 May 2026" },
  { id: "LR-2053", employeeId: "EMP-1006", employeeName: "Devansh Rao",  type: "earned", from: "01 Jul 2026", to: "08 Jul 2026", days: 6, reason: "Wedding in family",      status: "pending", appliedOn: "12 May 2026" },
];

export const recentAttendance: AttendanceRecord[] = [
  { date: "15 May", checkIn: "09:42",  checkOut: "18:51", hours: 9.1, status: "present" },
  { date: "14 May", checkIn: "09:31",  checkOut: "19:12", hours: 9.6, status: "present" },
  { date: "13 May", checkIn: "10:02",  checkOut: "18:33", hours: 8.5, status: "present" },
  { date: "12 May",                                             status: "leave"   },
  { date: "11 May",                                             status: "weekend" },
  { date: "10 May",                                             status: "weekend" },
  { date: "09 May", checkIn: "09:21",  checkOut: "18:40", hours: 9.3, status: "present" },
];

export const payslips: Payslip[] = [
  { id: "PS-2604", month: "April",    year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "paid"       },
  { id: "PS-2603", month: "March",    year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "paid"       },
  { id: "PS-2602", month: "February", year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "paid"       },
  { id: "PS-2605", month: "May",      year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "processing" },
];

export const announcements: Announcement[] = [
  { id: "AN-014", title: "Updated WFH policy",          body: "Starting June, hybrid teams move to 3 days in-office. Read the full memo on the People page.", postedBy: "Neha Kapoor",  postedOn: "14 May 2026", tag: "policy"      },
  { id: "AN-013", title: "Town hall · Friday 4 PM",     body: "Q2 results, product roadmap, and an AMA with the founders.",                                   postedBy: "Priya Sharma", postedOn: "13 May 2026", tag: "event"       },
  { id: "AN-012", title: "Welcome Devansh to QA!",      body: "Say hi to our newest QA Engineer joining the Platform pod.",                                   postedBy: "People Team",   postedOn: "10 May 2026", tag: "celebration" },
];

export const holidays: Holiday[] = [
  { id: "H-01", date: "26 May 2026", name: "Buddha Purnima",       type: "optional" },
  { id: "H-02", date: "15 Aug 2026", name: "Independence Day",     type: "public"   },
  { id: "H-03", date: "02 Oct 2026", name: "Gandhi Jayanti",       type: "public"   },
  { id: "H-04", date: "01 Nov 2026", name: "Diwali",               type: "public"   },
];

export const adminStats = {
  totalEmployees: 184,
  presentToday: 162,
  onLeave: 9,
  newHires: 4,
  pendingRequests: pendingLeaveRequests.length,
  openRoles: 7,
};

export const departments = [
  { name: "Engineering", headcount: 72, color: "#4F46E5" },
  { name: "Design",      headcount: 14, color: "#0EA5E9" },
  { name: "People",      headcount: 8,  color: "#10B981" },
  { name: "Marketing",   headcount: 18, color: "#F59E0B" },
  { name: "Finance",     headcount: 11, color: "#EF4444" },
  { name: "Sales",       headcount: 41, color: "#8B5CF6" },
];
