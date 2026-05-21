import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requirePermission } from "../middleware/permissions.js";
import * as payrollService from "../services/payrollService.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireAdmin,
  requirePermission("payroll.view"),
  asyncHandler(async (_req, res) => {
    res.json(await payrollService.getPayrollState());
  }),
);

router.get(
  "/summary",
  requireAuth,
  requireAdmin,
  requirePermission("payroll.view"),
  asyncHandler(async (_req, res) => {
    res.json(await payrollService.getPayrollSummary());
  }),
);

router.post(
  "/advance",
  requireAuth,
  requireAdmin,
  requirePermission("payroll.run"),
  asyncHandler(async (req, res) => {
    res.json(await payrollService.advancePayroll(req));
  }),
);

router.post(
  "/publish",
  requireAuth,
  requireAdmin,
  requirePermission("payroll.run"),
  asyncHandler(async (req, res) => {
    res.json(await payrollService.publishPayslips(req));
  }),
);

router.get(
  "/payslips",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await payrollService.getEmployeePayslips(req.user.employeeId));
  }),
);

export default router;
