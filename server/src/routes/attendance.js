import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as attendanceService from "../services/attendanceService.js";

const router = Router();

router.get(
  "/today",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await attendanceService.getTodayAttendance(req.user.employeeId));
  }),
);

router.get(
  "/history",
  requireAuth,
  asyncHandler(async (req, res) => {
    const days = Math.min(30, Number(req.query.days) || 14);
    res.json(
      await attendanceService.getAttendanceHistory(req.user.employeeId, days),
    );
  }),
);

router.put(
  "/today",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(
      await attendanceService.saveTodayAttendance(req.user.employeeId, req.body),
    );
  }),
);

router.post(
  "/clock-in",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await attendanceService.clockIn(req, req.user));
  }),
);

router.post(
  "/clock-out",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await attendanceService.clockOut(req, req.user));
  }),
);

export default router;
