import { Employee, LeaveRequest, OrgEvent, Notice } from "../models/index.js";
import { getAttendanceTrend } from "./attendanceService.js";
import { getDepartmentStats } from "./employeeService.js";

const DEPT_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export async function getDashboardStats() {
  const employees = await Employee.findAll();
  const leaveRequests = await LeaveRequest.findAll();
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
  }));

  const notices = await Notice.findAll({ order: [["sortOrder", "ASC"]] });
  const noticeBoard = notices.map((n) => ({
    id: n.id,
    title: n.title,
    date: n.dateLabel,
  }));

  const attendanceTrend = await getAttendanceTrend();

  return {
    departmentEngagement,
    upcomingEvents,
    noticeBoard,
    attendanceTrend,
  };
}
