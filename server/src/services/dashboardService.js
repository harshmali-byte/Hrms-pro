import { AttendanceDay, Employee, LeaveRequest, OrgEvent, Notice } from "../models/index.js";
import { getAttendanceTrend } from "./attendanceService.js";
import { getDepartmentStats } from "./employeeService.js";
import { employeeToJson } from "../utils/serializers.js";
import { todayKey } from "../utils/dates.js";

const DEPT_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const EVENT_DETAILS = {
  E1: "Engineering leads review UAT sign-off for Ne Family insurance policy flows before UK go-live.",
  E2: "Cross-functional stand-up for Bakali peak harvest — Creative and Engineering align catalog and logistics.",
  E3: "Founders sync at Junagadh HQ: delivery priorities, hiring, and client pipeline for Q2.",
};

const NOTICE_DETAILS = {
  NB1: "Code freeze and release window for Ne Family production deploy. All PRs need admin approval after Thu 2 PM.",
  NB2: "Extended support hours during mango season. Creative and ops to cover weekend order spikes.",
  NB3: "Weekly Hubstaff compliance review — minimum 35h logged for billable roles; exceptions via HR.",
};

function parseJoinedOn(joinedOn) {
  if (!joinedOn) return null;
  const d = new Date(joinedOn);
  return Number.isNaN(d.getTime()) ? null : d;
}

function countNewJoiners(employees, days = 60) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return employees.filter((e) => {
    const d = parseJoinedOn(e.joinedOn);
    return d && d >= cutoff;
  }).length;
}

export async function getClockedInToday() {
  const dateKey = todayKey();
  const rows = await AttendanceDay.findAll({ where: { dateKey } });
  const ids = [];
  for (const row of rows) {
    const segs = row.segments || [];
    if (segs.length && segs[segs.length - 1].out === null) ids.push(row.employeeId);
  }
  if (!ids.length) return [];
  const employees = await Employee.findAll({ where: { id: ids } });
  return employees.map(employeeToJson);
}

export async function getDashboardStats() {
  const employees = await Employee.findAll();
  const leaveRequests = await LeaveRequest.findAll();
  const total = employees.length;
  const onLeave = employees.filter((e) => e.status === "onLeave").length;
  const active = employees.filter((e) => e.status === "active").length;
  const probation = employees.filter((e) => e.status === "probation").length;
  const newJoiners = countNewJoiners(employees);
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

export async function getDashboardCharts() {
  const deptStats = await getDepartmentStats();
  const departmentEngagement = deptStats.map((d, i) => ({
    label: d.name,
    value: d.headcount,
    color: d.color ?? DEPT_COLORS[i % DEPT_COLORS.length],
  }));

  const events = await OrgEvent.findAll({ order: [["sortOrder", "ASC"]] });
  const upcomingEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    when: e.whenLabel,
    description: EVENT_DETAILS[e.id] ?? e.title,
  }));

  const notices = await Notice.findAll({ order: [["sortOrder", "ASC"]] });
  const noticeBoard = notices.map((n) => ({
    id: n.id,
    title: n.title,
    date: n.dateLabel,
    description: NOTICE_DETAILS[n.id] ?? n.title,
  }));

  const attendanceTrend = await getAttendanceTrend();

  return {
    departmentEngagement,
    upcomingEvents,
    noticeBoard,
    attendanceTrend,
  };
}
