import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requirePermission } from "../middleware/permissions.js";
import * as employeeService from "../services/employeeService.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("employees.view"),
  asyncHandler(async (_req, res) => {
    res.json(await employeeService.listEmployees());
  }),
);

router.get(
  "/departments",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await employeeService.getDepartmentStats());
  }),
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("employees.view"),
  asyncHandler(async (req, res) => {
    res.json(await employeeService.getEmployee(req.params.id));
  }),
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  requirePermission("employees.edit"),
  asyncHandler(async (req, res) => {
    const employee = await employeeService.createEmployee(req, req.body);
    res.status(201).json(employee);
  }),
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  requirePermission("employees.edit"),
  asyncHandler(async (req, res) => {
    res.json(await employeeService.updateEmployee(req, req.params.id, req.body));
  }),
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  requirePermission("employees.edit"),
  asyncHandler(async (req, res) => {
    res.json(await employeeService.deleteEmployee(req, req.params.id));
  }),
);

export default router;
