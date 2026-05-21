import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requirePermission } from "../middleware/permissions.js";
import * as leaveService from "../services/leaveService.js";

const router = Router();

router.get(
  "/requests",
  requireAuth,
  requirePermission("leave.view"),
  asyncHandler(async (req, res) => {
    res.json(await leaveService.listLeaveRequests(req.user));
  }),
);

router.get(
  "/balances",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await leaveService.getLeaveBalances(req.user.employeeId));
  }),
);

router.post(
  "/requests",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.status(201).json(await leaveService.submitLeave(req, req.user, req.body));
  }),
);

router.patch(
  "/requests/:id/status",
  requireAuth,
  requireAdmin,
  requirePermission("leave.approve"),
  asyncHandler(async (req, res) => {
    res.json(await leaveService.updateLeaveStatus(req, req.params.id, req.body.status));
  }),
);

router.post(
  "/requests/:id/cancel",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await leaveService.cancelLeave(req, req.user, req.params.id));
  }),
);

export default router;
