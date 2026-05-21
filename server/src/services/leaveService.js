import { Op } from "sequelize";
import {
  Employee,
  LeaveRequest,
  LeaveBalance,
  LeavePolicy,
  User,
} from "../models/index.js";
import { AppError, assertFound } from "../utils/errors.js";
import { formatPostedDate, newId } from "../utils/dates.js";
import { leaveRequestToJson } from "../utils/serializers.js";
import { pushNotification, pushForRole } from "./notifications.js";
import { logAudit } from "./auditLog.js";

const leaveTypeLabel = {
  casual: "Casual",
  sick: "Sick",
  earned: "Earned",
  unpaid: "Unpaid",
};

export function leaveListWhere(user) {
  if (user.role === "admin") return {};
  if (user.employeeId) return { employeeId: user.employeeId };
  return { employeeId: "__none__" };
}

export async function listLeaveRequests(user) {
  const where = leaveListWhere(user);
  if (where.employeeId === "__none__") return [];
  const rows = await LeaveRequest.findAll({
    where,
    order: [["appliedOn", "DESC"]],
  });
  return rows.map(leaveRequestToJson);
}

export async function getLeaveBalances(employeeId) {
  if (!employeeId) return [];
  const rows = await LeaveBalance.findAll({ where: { employeeId } });
  return rows.map((b) => ({ type: b.type, total: b.total, used: b.used }));
}

async function validateLeavePolicy(type, days) {
  const policy = await LeavePolicy.findOne({ where: { type, active: true } });
  if (!policy) throw new AppError(`No active policy for ${type} leave`);
  if (days > policy.daysPerYear && policy.daysPerYear > 0) {
    throw new AppError(`Exceeds annual ${type} limit (${policy.daysPerYear} days)`);
  }
  return policy;
}

export async function submitLeave(req, user, input) {
  const employeeId = user.employeeId;
  if (!employeeId) throw new AppError("Employee profile required", 403);

  const { type, from, to, days, reason } = input;
  if (!type || !from || !to || !days || !reason?.trim()) {
    throw new AppError("All leave fields required");
  }

  await validateLeavePolicy(type, Number(days));

  const bal = await LeaveBalance.findOne({ where: { employeeId, type } });
  if (bal && bal.total > 0 && bal.used + Number(days) > bal.total) {
    throw new AppError(`Insufficient ${type} balance`);
  }

  const emp = await Employee.findByPk(employeeId);
  const request = await LeaveRequest.create({
    id: newId("LR"),
    employeeId,
    employeeName: emp?.name ?? user.name,
    type,
    from,
    to,
    days: Number(days),
    reason: reason.trim(),
    status: "pending",
    appliedOn: formatPostedDate(),
  });

  await pushNotification(
    user.id,
    "Leave submitted",
    `Your ${leaveTypeLabel[type]} request is pending approval.`,
  );
  await pushForRole(
    "admin",
    "New leave request",
    `${request.employeeName} applied for ${leaveTypeLabel[type]} leave.`,
    { User },
  );
  await logAudit(req, {
    action: "create",
    resource: "leave_request",
    resourceId: request.id,
    details: `${request.employeeName} submitted ${type} leave`,
  });

  return leaveRequestToJson(request);
}

export async function updateLeaveStatus(req, id, status) {
  if (!["approved", "rejected"].includes(status)) {
    throw new AppError("Invalid status");
  }

  const cur = await LeaveRequest.findByPk(id);
  assertFound(cur, "Leave request");
  if (cur.status === status) return { request: leaveRequestToJson(cur), leaveBalances: [] };

  const prev = cur.status;
  let leaveBalances = [];

  if (status === "approved" && prev === "pending") {
    const bal = await LeaveBalance.findOne({
      where: { employeeId: cur.employeeId, type: cur.type },
    });
    if (bal) {
      bal.used = Math.min(bal.total, bal.used + cur.days);
      await bal.save();
    }
  }

  if (status === "rejected" && prev === "approved") {
    const bal = await LeaveBalance.findOne({
      where: { employeeId: cur.employeeId, type: cur.type },
    });
    if (bal) {
      bal.used = Math.max(0, bal.used - cur.days);
      await bal.save();
    }
  }

  cur.status = status;
  await cur.save();

  const range = cur.from === cur.to ? cur.from : `${cur.from} → ${cur.to}`;
  const typeLabel = leaveTypeLabel[cur.type];
  const notifTitle = status === "approved" ? "Leave approved" : "Leave rejected";
  const notifBody =
    status === "approved"
      ? `${cur.employeeName}: ${typeLabel} leave (${range}, ${cur.days}d) approved.`
      : `${cur.employeeName}: ${typeLabel} leave (${range}) rejected.`;

  const employeeUser = await User.findOne({ where: { employeeId: cur.employeeId } });
  if (employeeUser) {
    await pushNotification(
      employeeUser.id,
      status === "approved" ? "Leave approved" : "Leave rejected",
      status === "approved"
        ? `Your ${typeLabel} leave (${range}, ${cur.days}d) was approved.`
        : `Your ${typeLabel} leave (${range}) was not approved.`,
    );
  }

  await pushForRole("admin", notifTitle, notifBody, { User });
  await logAudit(req, {
    action: status,
    resource: "leave_request",
    resourceId: cur.id,
    details: notifBody,
  });

  if (cur.employeeId) {
    leaveBalances = await getLeaveBalances(cur.employeeId);
  }

  return { request: leaveRequestToJson(cur), leaveBalances };
}

export async function cancelLeave(req, user, id) {
  const cur = await LeaveRequest.findByPk(id);
  assertFound(cur, "Leave request");
  if (cur.employeeId !== user.employeeId) throw new AppError("Forbidden", 403);
  if (cur.status !== "pending") throw new AppError("Only pending requests can be cancelled");

  await cur.update({
    status: "rejected",
    reason: `${cur.reason} (cancelled by employee)`,
  });
  await logAudit(req, {
    action: "cancel",
    resource: "leave_request",
    resourceId: id,
    details: `${cur.employeeName} cancelled leave request`,
  });
  return leaveRequestToJson(cur);
}
