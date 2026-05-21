import {
  Employee,
  LeaveRequest,
  Notification,
  PayrollRun,
  Payslip,
  Announcement,
  Holiday,
} from "../models/index.js";
import { todayKey } from "../utils/dates.js";
import {
  employeeToJson,
  leaveRequestToJson,
  notificationToJson,
  payslipToJson,
} from "../utils/serializers.js";
import { leaveListWhere } from "./leaveService.js";
import { getLeaveBalances } from "./leaveService.js";
import { getTodayAttendance } from "./attendanceService.js";

const defaultPayroll = () => ({
  steps: [
    { label: "Attendance reconciled", done: true },
    { label: "Reimbursements added", done: true },
    { label: "Tax & deductions", done: false },
    { label: "Approvals & disbursal", done: false },
  ],
  runStatus: "In progress",
});

export async function buildBootstrapState(user) {
  const employees = await Employee.findAll({ order: [["name", "ASC"]] });

  const leaveWhere = leaveListWhere(user);
  const leaveRequests =
    leaveWhere.employeeId === "__none__"
      ? []
      : await LeaveRequest.findAll({
          where: leaveWhere,
          order: [["appliedOn", "DESC"]],
        });

  const leaveBalances = user.employeeId
    ? await getLeaveBalances(user.employeeId)
    : [];

  const notifications = await Notification.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
    limit: 50,
  });

  const payrollRow =
    user.role === "admin" ? await PayrollRun.findByPk("default") : null;

  const attendance = await getTodayAttendance(user.employeeId);

  const payslips = user.employeeId
    ? await Payslip.findAll({
        where: { employeeId: user.employeeId },
        order: [["year", "DESC"], ["month", "DESC"]],
      })
    : [];

  const announcements = await Announcement.findAll({
    order: [["postedOn", "DESC"]],
    limit: 20,
  });

  const holidays = await Holiday.findAll({
    order: [["date", "ASC"]],
  });

  return {
    employees: employees.map(employeeToJson),
    leaveRequests: leaveRequests.map(leaveRequestToJson),
    leaveBalances,
    notifications: notifications.map(notificationToJson),
    payroll: payrollRow
      ? { steps: payrollRow.steps, runStatus: payrollRow.runStatus }
      : user.role === "admin"
        ? defaultPayroll()
        : { steps: [], runStatus: "In progress" },
    attendance,
    payslips: payslips.map(payslipToJson),
    announcements: announcements.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      postedBy: a.postedBy,
      postedOn: a.postedOn,
      tag: a.tag,
    })),
    holidays: holidays.map((h) => ({
      id: h.id,
      date: h.date,
      name: h.name,
      type: h.type,
    })),
    currentEmployeeId: user.employeeId,
    role: user.role,
  };
}
