import { PayrollRun, Payslip, Employee } from "../models/index.js";
import { AppError } from "../utils/errors.js";
import { payslipToJson } from "../utils/serializers.js";
import { pushForRole } from "./notifications.js";
import { User } from "../models/index.js";
import { logAudit } from "./auditLog.js";
import { formatPostedDate, newId } from "../utils/dates.js";

const DEFAULT_STEPS = [
  { label: "Attendance reconciled", done: true },
  { label: "Reimbursements added", done: true },
  { label: "Tax & deductions", done: false },
  { label: "Approvals & disbursal", done: false },
];

async function getPayrollRun() {
  let run = await PayrollRun.findByPk("default");
  if (!run) {
    run = await PayrollRun.create({
      id: "default",
      steps: DEFAULT_STEPS,
      runStatus: "In progress",
    });
  }
  return run;
}

export async function getPayrollState() {
  const run = await getPayrollRun();
  return { steps: run.steps, runStatus: run.runStatus };
}

export async function advancePayroll(req) {
  const run = await getPayrollRun();
  const next = [...run.steps];
  const i = next.findIndex((s) => !s.done);
  if (i === -1) {
    run.runStatus = "Locked";
    await run.save();
    return { steps: next, runStatus: run.runStatus };
  }
  next[i] = { ...next[i], done: true };
  const allDone = next.every((s) => s.done);
  run.steps = next;
  run.runStatus = allDone ? "Locked" : run.runStatus;
  await run.save();

  if (allDone) {
    await pushForRole(
      "admin",
      "Payroll locked",
      "Payroll cycle completed. Payslips will be published on schedule.",
      { User },
    );
    await pushForRole(
      "employee",
      "Payroll processed",
      "Payroll has been locked. Your payslip will appear when published.",
      { User },
    );
    await logAudit(req, {
      action: "lock",
      resource: "payroll_run",
      resourceId: "default",
      details: "Payroll run locked",
    });
  } else {
    await logAudit(req, {
      action: "advance",
      resource: "payroll_run",
      resourceId: "default",
      details: `Completed step: ${next[i].label}`,
    });
  }

  return { steps: run.steps, runStatus: run.runStatus };
}

export async function getEmployeePayslips(employeeId) {
  if (!employeeId) return [];
  const rows = await Payslip.findAll({
    where: { employeeId },
    order: [["year", "DESC"], ["month", "DESC"]],
  });
  return rows.map(payslipToJson);
}

export async function publishPayslips(req) {
  const run = await getPayrollRun();
  if (run.runStatus !== "Locked") {
    throw new AppError("Lock payroll before publishing payslips");
  }

  const employees = await Employee.findAll({ where: { status: "active" } });
  const month = formatPostedDate().split(" ")[1] + " " + new Date().getFullYear();
  let count = 0;

  for (const emp of employees) {
    const existing = await Payslip.findOne({
      where: { employeeId: emp.id, month: "May", year: 2026, status: "processing" },
    });
    if (existing) {
      existing.status = "paid";
      await existing.save();
      count += 1;
      continue;
    }
    await Payslip.create({
      id: newId("PS"),
      employeeId: emp.id,
      month: "May",
      year: 2026,
      gross: 142000,
      deductions: 18500,
      net: 123500,
      status: "paid",
    });
    count += 1;
  }

  await logAudit(req, {
    action: "publish",
    resource: "payslip",
    resourceId: "batch",
    details: `Published payslips for ${count} employees`,
  });

  return { published: count };
}

export async function getPayrollSummary() {
  const employees = await Employee.findAll();
  const active = employees.filter((e) => e.status === "active").length;
  const avgSalary = 142000;
  return {
    activeEmployees: active,
    avgSalaryPerHead: avgSalary,
    estimatedMonthlyOutflow: active * avgSalary,
  };
}
