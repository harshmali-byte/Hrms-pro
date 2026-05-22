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
} from "../models/index.js";
import {
  ASQUARIFY_EMPLOYEES,
  DEMO_AUTH_USERS,
  DEMO_EMPLOYEE_ID,
  DEMO_PASSWORD,
} from "../data/asquarifyTeam.js";
import { seedConfigData } from "./seedConfig.js";
import { syncAsquarifyUsers } from "./syncAsquarifyUsers.js";

const employees = ASQUARIFY_EMPLOYEES;

const defaultBalances = [
  { type: "casual", total: 12, used: 2 },
  { type: "sick", total: 10, used: 1 },
  { type: "earned", total: 18, used: 3 },
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

function workSegments(hours = 8.5) {
  const start = new Date();
  start.setHours(9, 15, 0, 0);
  const end = new Date(start.getTime() + hours * 3600000);
  return [{ in: start.getTime(), out: end.getTime() }];
}

export async function seedHrData() {
  await Employee.bulkCreate(employees);

  await LeaveRequest.bulkCreate([
    {
      id: "LR-3001",
      employeeId: DEMO_EMPLOYEE_ID,
      employeeName: "Harsh Mali",
      type: "casual",
      from: "12 May 2026",
      to: "12 May 2026",
      days: 1,
      reason: "Personal work in Junagadh",
      status: "approved",
      appliedOn: "08 May 2026",
    },
    {
      id: "LR-3002",
      employeeId: DEMO_EMPLOYEE_ID,
      employeeName: "Harsh Mali",
      type: "sick",
      from: "22 Apr 2026",
      to: "22 Apr 2026",
      days: 1,
      reason: "Rest day",
      status: "approved",
      appliedOn: "21 Apr 2026",
    },
    {
      id: "LR-3003",
      employeeId: DEMO_EMPLOYEE_ID,
      employeeName: "Harsh Mali",
      type: "earned",
      from: "10 Jun 2026",
      to: "12 Jun 2026",
      days: 3,
      reason: "Short break before Ne Family release",
      status: "pending",
      appliedOn: "10 May 2026",
    },
    {
      id: "LR-3004",
      employeeId: "EMP-0007",
      employeeName: "Monil Thakrar",
      type: "casual",
      from: "18 May 2026",
      to: "18 May 2026",
      days: 1,
      reason: "Family function",
      status: "pending",
      appliedOn: "15 May 2026",
    },
    {
      id: "LR-3005",
      employeeId: "EMP-0004",
      employeeName: "Savan Vagadiya",
      type: "earned",
      from: "25 May 2026",
      to: "27 May 2026",
      days: 3,
      reason: "Travel",
      status: "pending",
      appliedOn: "14 May 2026",
    },
    {
      id: "LR-3006",
      employeeId: "EMP-0005",
      employeeName: "Shubham Bhatt",
      type: "casual",
      from: "20 May 2026",
      to: "20 May 2026",
      days: 1,
      reason: "Content shoot — Bakali campaign",
      status: "pending",
      appliedOn: "13 May 2026",
    },
  ]);

  for (const emp of employees) {
    const used =
      emp.id === DEMO_EMPLOYEE_ID
        ? defaultBalances
        : defaultBalances.map((b) => ({ ...b, used: Math.min(b.used, 1) }));
    await LeaveBalance.bulkCreate(used.map((b) => ({ ...b, employeeId: emp.id })));
  }

  await Payslip.bulkCreate([
    {
      id: "PS-2604",
      employeeId: DEMO_EMPLOYEE_ID,
      month: "April",
      year: 2026,
      gross: 85000,
      deductions: 8500,
      net: 76500,
      status: "paid",
    },
    {
      id: "PS-2603",
      employeeId: DEMO_EMPLOYEE_ID,
      month: "March",
      year: 2026,
      gross: 85000,
      deductions: 8500,
      net: 76500,
      status: "paid",
    },
    {
      id: "PS-2602",
      employeeId: DEMO_EMPLOYEE_ID,
      month: "February",
      year: 2026,
      gross: 80000,
      deductions: 8000,
      net: 72000,
      status: "paid",
    },
    {
      id: "PS-2605",
      employeeId: DEMO_EMPLOYEE_ID,
      month: "May",
      year: 2026,
      gross: 85000,
      deductions: 8500,
      net: 76500,
      status: "processing",
    },
  ]);

  await PayrollRun.create({
    id: "default",
    steps: [
      { label: "Attendance reconciled (Hubstaff)", done: true },
      { label: "Project allocations — Ne Family / Bakali", done: true },
      { label: "Tax & deductions", done: false },
      { label: "Founder approval & disbursal", done: false },
    ],
    runStatus: "In progress",
  });

  for (let i = 1; i <= 6; i++) {
    await AttendanceDay.create({
      employeeId: DEMO_EMPLOYEE_ID,
      dateKey: pastDateKey(i),
      segments: workSegments(8 + (i % 2) * 0.5),
    });
  }

  await Announcement.bulkCreate([
    {
      id: "AN-101",
      title: "Ne Family — UK insurance go-live prep",
      body: "Engineering freeze starts 28 May. QA sign-off on claims flow is the top priority this sprint.",
      postedBy: "Aftab Alam",
      postedOn: "15 May 2026",
      tag: "project",
    },
    {
      id: "AN-102",
      title: "Bakali mango season is live",
      body: "Fresh inventory is up on the shop. Shubham’s campaign assets drop this week — share on social!",
      postedBy: "Bhargav Purohit",
      postedOn: "14 May 2026",
      tag: "celebration",
    },
    {
      id: "AN-103",
      title: "Welcome to Junagadh HQ · 2026",
      body: "Asquarify is home in Gujarat. Hybrid-friendly: build automation that ships on time, every time.",
      postedBy: "Bhargav Purohit",
      postedOn: "01 Jan 2026",
      tag: "policy",
    },
  ]);

  await Holiday.bulkCreate([
    { id: "H-01", date: "26 Jan 2026", name: "Republic Day", type: "public" },
    { id: "H-02", date: "14 Mar 2026", name: "Dhuleti", type: "optional" },
    { id: "H-03", date: "15 Aug 2026", name: "Independence Day", type: "public" },
    { id: "H-04", date: "02 Oct 2026", name: "Gandhi Jayanti", type: "public" },
  ]);

  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdUsers = {};
  for (const demo of DEMO_AUTH_USERS) {
    const row = await User.create({
      email: demo.email.trim().toLowerCase(),
      passwordHash: hash,
      role: demo.role,
      employeeId: demo.employeeId,
      name: demo.name,
    });
    createdUsers[demo.role] = row;
  }
  const employeeUser = createdUsers.employee;
  const adminUser = createdUsers.admin;

  await Notification.bulkCreate([
    {
      id: "N-01",
      userId: employeeUser.id,
      title: "Ne Family sprint review",
      body: "Stand-up moved to 10:30 AM — demo claims module.",
      read: false,
      createdAtLabel: "15 May 2026",
    },
    {
      id: "N-02",
      userId: employeeUser.id,
      title: "Hubstaff reminder",
      body: "Keep Hubstaff running during core hours for client reporting.",
      read: false,
      createdAtLabel: "14 May 2026",
    },
    {
      id: "N-03",
      userId: employeeUser.id,
      title: "Bakali promo assets",
      body: "Shubham shared folder — review before Friday publish.",
      read: true,
      createdAtLabel: "12 May 2026",
    },
    {
      id: "N-A01",
      userId: adminUser.id,
      title: "Leave queue",
      body: "3 requests from Engineering & Creative need approval.",
      read: false,
      createdAtLabel: "15 May 2026",
    },
    {
      id: "N-A02",
      userId: adminUser.id,
      title: "Payroll — May cycle",
      body: "Complete tax step before founder sign-off.",
      read: false,
      createdAtLabel: "14 May 2026",
    },
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
    console.log("Database exists — syncing Asquarify config & demo users…");
    await seedConfigData();
    await syncAsquarifyUsers();
    return;
  }

  await seedConfigData();
  await seedHrData();

  console.log("Seed complete — Asquarify");
  console.log("Employee: harsh.mali@asquarify.co / demo123");
  console.log("Admin:    bhargav.purohit@asquarify.co / demo123");
}
