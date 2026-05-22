import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getTodayAttendance } from "../services/attendanceService.js";
import {
  getHubstaffStatus,
  getHubstaffSummaryForUser,
} from "../services/hubstaffService.js";

const router = Router();

router.get(
  "/status",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(getHubstaffStatus());
  }),
);

router.get(
  "/summary",
  requireAuth,
  asyncHandler(async (req, res) => {
    let hrmsCheckedIn = false;
    if (req.user.employeeId) {
      const day = await getTodayAttendance(req.user.employeeId);
      const segs = day.segments ?? [];
      hrmsCheckedIn = segs.length > 0 && segs[segs.length - 1].out === null;
    }

    const summary = await getHubstaffSummaryForUser({
      email: req.user.email,
      hrmsCheckedIn,
    });

    res.json(summary);
  }),
);

export default router;
