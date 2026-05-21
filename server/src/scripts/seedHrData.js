import bcrypt from "bcryptjs";
import {
  User,
  Employee,
  LeaveRequest,
  LeaveBalance,
  Notification,
  Payslip,
  PayrollRun,
  AttendanceDay,
  Announcement,
  Holiday,
  LeavePolicy,
} from "../models/index.js";
import { seedConfigData } from "./seedConfig.js";

const employees = [
  { id: "EMP-1001", name: "Priya Sharma", role: "Engineering Manager", department: "Engineering", email: "priya@organiq.co", phone: "+91 90000 11001", avatarColor: "#4F46E5", joinedOn: "04 Jan 2020", status: "active", employeeCode: "ORG-1001", location: "Bengaluru, IN" },
  { id: "EMP-1002", name: "Rohan Iyer", role: "Senior Backend Engineer", department: "Engineering", email: "rohan@organiq.co", phone: "+91 90000 11002", avatarColor: "#0EA5E9", joinedOn: "16 Aug 2021", status: "active", employeeCode: "ORG-1002", location: "Bengaluru, IN" },
  { id: "EMP-1003", name: "Neha Kapoor", role: "Talent Partner", department: "People", email: "neha@organiq.co", phone: "+91 90000 11003", avatarColor: "#10B981", joinedOn: "02 Feb 2023", status: "active", employeeCode: "ORG-1003", location: "Bengaluru, IN" },
  { id: "EMP-1004", name: "Karan Patel", role: "Finance Lead", department: "Finance", email: "karan@organiq.co", phone: "+91 90000 11004", avatarColor: "#F59E0B", joinedOn: "11 Nov 2019", status: "onLeave", employeeCode: "ORG-1004", location: "Mumbai, IN" },
  { id: "EMP-1005", name: "Ishita Verma", role: "Marketing Specialist", department: "Marketing", email: "ishita@organiq.co", phone: "+91 90000 11005", avatarColor: "#EF4444", joinedOn: "27 May 2022", status: "active", employeeCode: "ORG-1005", location: "Bengaluru, IN" },
  { id: "EMP-1006", name: "Devansh Rao", role: "QA Engineer", department: "Engineering", email: "devansh@organiq.co", phone: "+91 90000 11006", avatarColor: "#8B5CF6", joinedOn: "19 Sep 2023", status: "probation", employeeCode: "ORG-1006", location: "Bengaluru, IN" },
  { id: "EMP-1042", name: "Aarav Mehta", role: "Senior Product Designer", department: "Design", email: "aarav.mehta@organiq.co", phone: "+91 98765 43210", avatarColor: "#4F46E5", joinedOn: "12 Mar 2022", status: "active", employeeCode: "ORG-1042", location: "Bengaluru, IN", reportsTo: "Priya Sharma" },
];

const defaultBalances = [
  { type: "casual", total: 12, used: 4 },
  { type: "sick", total: 10, used: 2 },
  { type: "earned", total: 18, used: 6 },
  { type: "unpaid", total: 0, used: 0 },
];

function pastDateKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function workSegments(hours = 9) {
  const start = new Date();
  start.setHours(9, 30, 0, 0);
  const end = new Date(start.getTime() + hours * 3600000);
  return [{ in: start.getTime(), out: end.getTime() }];
}

export async function seedHrData() {
  await Employee.bulkCreate(employees);
  await LeaveRequest.bulkCreate([
    { id: "LR-2041", employeeId: "EMP-1042", employeeName: "Aarav Mehta", type: "casual", from: "12 May 2026", to: "12 May 2026", days: 1, reason: "Personal errand", status: "approved", appliedOn: "08 May 2026" },
    { id: "LR-2038", employeeId: "EMP-1042", employeeName: "Aarav Mehta", type: "sick", from: "21 Apr 2026", to: "22 Apr 2026", days: 2, reason: "Fever and rest", status: "approved", appliedOn: "21 Apr 2026" },
    { id: "LR-2032", employeeId: "EMP-1042", employeeName: "Aarav Mehta", type: "earned", from: "02 Jun 2026", to: "06 Jun 2026", days: 5, reason: "Family trip to Coorg", status: "pending", appliedOn: "10 May 2026" },
    { id: "LR-2051", employeeId: "EMP-1002", employeeName: "Rohan Iyer", type: "sick", from: "16 May 2026", to: "17 May 2026", days: 2, reason: "Migraine", status: "pending", appliedOn: "15 May 2026" },
    { id: "LR-2052", employeeId: "EMP-1005", employeeName: "Ishita Verma", type: "casual", from: "20 May 2026", to: "20 May 2026", days: 1, reason: "Apartment registration", status: "pending", appliedOn: "14 May 2026" },
    { id: "LR-2053", employeeId: "EMP-1006", employeeName: "Devansh Rao", type: "earned", from: "01 Jul 2026", to: "08 Jul 2026", days: 6, reason: "Wedding in family", status: "pending", appliedOn: "12 May 2026" },
  ]);

  for (const emp of employees) {
    const used = emp.id === "EMP-1042" ? defaultBalances : defaultBalances.map((b) => ({ ...b, used: 0 }));
    await LeaveBalance.bulkCreate(used.map((b) => ({ ...b, employeeId: emp.id })));
  }

  await Payslip.bulkCreate([
    { id: "PS-2604", employeeId: "EMP-1042", month: "April", year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "paid" },
    { id: "PS-2603", employeeId: "EMP-1042", month: "March", year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "paid" },
    { id: "PS-2602", employeeId: "EMP-1042", month: "February", year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "paid" },
    { id: "PS-2605", employeeId: "EMP-1042", month: "May", year: 2026, gross: 142000, deductions: 18500, net: 123500, status: "processing" },
  ]);

  await PayrollRun.create({
    id: "default",
    steps: [
      { label: "Attendance reconciled", done: true },
      { label: "Reimbursements added", done: true },
      { label: "Tax & deductions", done: false },
      { label: "Approvals & disbursal", done: false },
    ],
    runStatus: "In progress",
  });

  for (let i = 1; i <= 6; i++) {
    await AttendanceDay.create({
      employeeId: "EMP-1042",
      dateKey: pastDateKey(i),
      segments: workSegments(8 + (i % 3) * 0.3),
    });
  }

  await Announcement.bulkCreate([
    { id: "AN-014", title: "Updated WFH policy", body: "Starting June, hybrid teams move to 3 days in-office.", postedBy: "Neha Kapoor", postedOn: "14 May 2026", tag: "policy" },
    { id: "AN-013", title: "Town hall · Friday 4 PM", body: "Q2 results, product roadmap, and an AMA with the founders.", postedBy: "Priya Sharma", postedOn: "13 May 2026", tag: "event" },
    { id: "AN-012", title: "Welcome Devansh to QA!", body: "Say hi to our newest QA Engineer joining the Platform pod.", postedBy: "People Team", postedOn: "10 May 2026", tag: "celebration" },
  ]);

  await Holiday.bulkCreate([
    { id: "H-01", date: "26 May 2026", name: "Buddha Purnima", type: "optional" },
    { id: "H-02", date: "15 Aug 2026", name: "Independence Day", type: "public" },
    { id: "H-03", date: "02 Oct 2026", name: "Gandhi Jayanti", type: "public" },
    { id: "H-04", date: "01 Nov 2026", name: "Diwali", type: "public" },
  ]);

  const hash = await bcrypt.hash("demo123", 10);
  const employeeUser = await User.create({
    email: "aarav.mehta@organiq.co",
    passwordHash: hash,
    role: "employee",
    employeeId: "EMP-1042",
    name: "Aarav Mehta",
  });
  const adminUser = await User.create({
    email: "admin@organiq.co",
    passwordHash: hash,
    role: "admin",
    employeeId: null,
    name: "John Doe",
  });

  await Notification.bulkCreate([
    { id: "N-01", userId: employeeUser.id, title: "Approve your timesheet", body: "May week 2 timesheet is ready for review.", read: false, createdAtLabel: "15 May 2026" },
    { id: "N-02", userId: employeeUser.id, title: "Policy acknowledgment", body: "Please acknowledge the updated WFH policy by 20 May.", read: false, createdAtLabel: "14 May 2026" },
    { id: "N-03", userId: employeeUser.id, title: "Benefits enrollment", body: "Open enrollment closes this Friday.", read: true, createdAtLabel: "11 May 2026" },
    { id: "N-A01", userId: adminUser.id, title: "Pending leave queue", body: "4 requests need your review.", read: false, createdAtLabel: "15 May 2026" },
    { id: "N-A02", userId: adminUser.id, title: "Payroll in progress", body: "Complete tax step before lock.", read: false, createdAtLabel: "14 May 2026" },
  ]);
}

export async function seedDatabase({ force = false } = {}) {
  const { sequelize } = await import("../models/index.js");

  if (force) {
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }

  const count = await Employee.count();
  if (count > 0 && !force) {
    console.log("Database already seeded. Use --force to reset.");
    await seedConfigData();
    return;
  }

  await seedConfigData();
  await seedHrData();

  console.log("Seed complete.");
  console.log("Employee: aarav.mehta@organiq.co / demo123");
  console.log("Admin:    admin@organiq.co / demo123");
}
