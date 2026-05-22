import {
  Employee,
  LeaveRequest,
  Payslip,
  PayrollRun,
  Holiday,
  Announcement,
  AttendanceDay,
  Notification,
} from "../models/index.js";
import { todayKey } from "../utils/dates.js";
import { getLeaveBalances } from "./leaveService.js";
import { getTodayAttendance } from "./attendanceService.js";
import { getAttendanceTrend, getDashboardCharts, getDashboardStats } from "./dashboardService.js";

function formatDurationHuman(ms) {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

async function countTeamClockedInToday() {
  const dateKey = todayKey();
  const rows = await AttendanceDay.findAll({ where: { dateKey } });
  let count = 0;
  for (const row of rows) {
    const segs = row.segments || [];
    if (segs.length && segs[segs.length - 1].out === null) count += 1;
  }
  return count;
}

/** @param {import("../models/User.js").User} user */
export async function getEmployeeDashboardWidgets(user) {
  const employeeId = user.employeeId;
  if (!employeeId) return { widgets: [] };

  const [balances, attendance, history, payslips, holidays, myLeaves, notifUnread] =
    await Promise.all([
      getLeaveBalances(employeeId),
      getTodayAttendance(employeeId),
      AttendanceDay.findAll({
        where: { employeeId },
        order: [["dateKey", "DESC"]],
        limit: 14,
      }),
      Payslip.findAll({
        where: { employeeId },
        order: [["year", "DESC"], ["month", "DESC"]],
        limit: 1,
      }),
      Holiday.findAll({ order: [["date", "ASC"]], limit: 3 }),
      LeaveRequest.findAll({ where: { employeeId }, order: [["appliedOn", "DESC"]] }),
      Notification.count({ where: { userId: user.id, read: false } }),
    ]);

  const segments = attendance.segments || [];
  const isCheckedIn = segments.length > 0 && segments[segments.length - 1].out === null;
  const workedMs = segments.reduce((acc, s) => {
    const end = s.out ?? Date.now();
    return acc + Math.max(0, end - s.in);
  }, 0);

  const leaveRemaining = balances.reduce(
    (sum, b) => sum + Math.max(0, (b.total ?? 0) - (b.used ?? 0)),
    0,
  );
  const pendingMine = myLeaves.filter((r) => r.status === "pending").length;
  const approvedMine = myLeaves.filter((r) => r.status === "approved").length;
  const presentDays = history.filter((d) => (d.segments || []).length > 0).length;
  const latestPayslip = payslips[0];
  const nextHoliday = holidays[0];

  const widgets = [
    {
      id: "work-today",
      type: "metric",
      title: "Worked today",
      value: formatDurationHuman(workedMs),
      subtitle: isCheckedIn ? "Currently on shift" : "Not clocked in",
      tone: isCheckedIn ? "success" : "default",
      icon: "clock",
      action: { type: "navigate", target: "attendance" },
    },
    {
      id: "clock-status",
      type: "status",
      title: "Clock status",
      value: isCheckedIn ? "Clocked in" : "Clocked out",
      subtitle: isCheckedIn ? "Hubstaff & HRMS active" : "Clock in from Attendance",
      tone: isCheckedIn ? "success" : "warning",
      icon: "log-in",
      action: { type: "navigate", target: "attendance" },
    },
    {
      id: "leave-balance",
      type: "metric",
      title: "Leave available",
      value: String(leaveRemaining),
      subtitle: "Days across all types",
      tone: "primary",
      icon: "calendar",
      action: { type: "navigate", target: "leave" },
    },
    {
      id: "leave-pending",
      type: "metric",
      title: "Pending leave",
      value: String(pendingMine),
      subtitle: pendingMine ? "Awaiting approval" : "No open requests",
      tone: pendingMine ? "warning" : "default",
      icon: "plane",
      action: { type: "navigate", target: "leave" },
    },
    {
      id: "attendance-week",
      type: "metric",
      title: "Days present (14d)",
      value: String(presentDays),
      subtitle: "From attendance history",
      tone: "success",
      icon: "calendar-check",
      action: { type: "navigate", target: "attendance" },
    },
    {
      id: "payslip-latest",
      type: "card",
      title: "Latest payslip",
      value: latestPayslip ? `${latestPayslip.month} ${latestPayslip.year}` : "—",
      subtitle: latestPayslip
        ? `Net ₹${latestPayslip.net.toLocaleString("en-IN")} · ${latestPayslip.status}`
        : "No payslips yet",
      tone: latestPayslip?.status === "paid" ? "success" : "primary",
      icon: "receipt",
      action: { type: "navigate", target: "payslip" },
    },
    {
      id: "notifications",
      type: "metric",
      title: "Unread alerts",
      value: String(notifUnread),
      subtitle: "Open bell icon above",
      tone: notifUnread > 0 ? "warning" : "default",
      icon: "bell",
    },
    {
      id: "next-holiday",
      type: "card",
      title: "Next holiday",
      value: nextHoliday?.name ?? "—",
      subtitle: nextHoliday
        ? `${nextHoliday.date} · ${nextHoliday.type === "public" ? "Public" : "Optional"}`
        : "Calendar not published",
      tone: "info",
      icon: "sparkles",
    },
    {
      id: "leave-approved",
      type: "metric",
      title: "Approved leave",
      value: String(approvedMine),
      subtitle: "All-time approved requests",
      tone: "success",
      icon: "check",
      action: { type: "navigate", target: "leave" },
    },
  ];

  return { widgets: widgets.slice(0, 10) };
}

export async function getAdminDashboardWidgets() {
  const [stats, charts, payroll, teamIn, announcements] = await Promise.all([
    getDashboardStats(),
    getDashboardCharts(),
    PayrollRun.findByPk("default"),
    countTeamClockedInToday(),
    Announcement.findAll({ order: [["postedOn", "DESC"]], limit: 3 }),
  ]);

  const payrollSteps = payroll?.steps ?? [];
  const doneSteps = payrollSteps.filter((s) => s.done).length;
  const payrollPct = payrollSteps.length
    ? Math.round((doneSteps / payrollSteps.length) * 100)
    : 0;

  const deptTop = charts.departmentEngagement?.[0];
  const nextEvent = charts.upcomingEvents?.[0];
  const topNotice = charts.noticeBoard?.[0];

  const widgets = [
    {
      id: "total-team",
      type: "metric",
      title: "Total employees",
      value: String(stats.totalEmployees),
      subtitle: stats.trends.totalEmployees.text,
      trend: stats.trends.totalEmployees,
      tone: "primary",
      icon: "users",
      action: { type: "navigate", target: "people" },
    },
    {
      id: "pending-leave",
      type: "metric",
      title: "Pending approvals",
      value: String(stats.pendingRequests),
      subtitle: stats.pendingRequests ? "Needs your review" : "Queue clear",
      tone: stats.pendingRequests ? "warning" : "success",
      icon: "inbox",
      action: { type: "navigate", target: "requests" },
    },
    {
      id: "on-leave",
      type: "metric",
      title: "On leave today",
      value: String(stats.onLeave),
      subtitle: stats.trends.onLeave.text,
      trend: stats.trends.onLeave,
      tone: "info",
      icon: "user-x",
      action: { type: "navigate", target: "people" },
    },
    {
      id: "active-team",
      type: "metric",
      title: "Active workforce",
      value: String(stats.activeEmployees),
      subtitle: stats.trends.activeEmployees.text,
      trend: stats.trends.activeEmployees,
      tone: "success",
      icon: "trending-up",
      action: { type: "navigate", target: "people" },
    },
    {
      id: "clocked-in-now",
      type: "metric",
      title: "Clocked in now",
      value: String(teamIn),
      subtitle: "Live from today's punches",
      tone: teamIn > 0 ? "success" : "default",
      icon: "activity",
      action: { type: "navigate", target: "people" },
    },
    {
      id: "payroll-progress",
      type: "progress",
      title: "Payroll cycle",
      value: `${payrollPct}%`,
      subtitle: payroll?.runStatus ?? "In progress",
      progress: { current: doneSteps, total: payrollSteps.length || 4 },
      tone: "primary",
      icon: "wallet",
      action: { type: "navigate", target: "payroll" },
    },
    {
      id: "top-department",
      type: "card",
      title: "Largest department",
      value: deptTop?.label ?? "—",
      subtitle: deptTop ? `${deptTop.value} people` : "No data",
      tone: "info",
      icon: "building",
      action: { type: "navigate", target: "people" },
    },
    {
      id: "next-event",
      type: "card",
      title: "Next event",
      value: nextEvent?.title ?? "—",
      subtitle: nextEvent?.when ?? "See dashboard calendar",
      tone: "primary",
      icon: "calendar",
      action: { type: "navigate", target: "dashboard" },
    },
    {
      id: "notice",
      type: "card",
      title: "Latest notice",
      value: topNotice?.title ?? "—",
      subtitle: topNotice?.date ?? "Notice board",
      tone: "warning",
      icon: "megaphone",
      action: { type: "navigate", target: "dashboard" },
    },
    {
      id: "projects",
      type: "metric",
      title: "Active projects",
      value: "3",
      subtitle: "Ne Family · Bakali · HRMS",
      tone: "success",
      icon: "briefcase",
      action: { type: "navigate", target: "settings" },
    },
  ];

  return {
    widgets: widgets.slice(0, 10),
    charts,
    stats,
  };
}
