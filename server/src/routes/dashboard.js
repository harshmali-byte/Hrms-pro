import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as dashboardService from "../services/dashboardService.js";

const router = Router();

router.get(
  "/stats",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await dashboardService.getDashboardStats());
  }),
);

router.get(
  "/charts",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await dashboardService.getDashboardCharts());
  }),
);

router.get(
  "/clocked-in",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
      res.status(403).json({ error: "Admin only" });
      return;
    }
    const { getClockedInToday } = await import("../services/dashboardService.js");
    res.json({ employees: await getClockedInToday() });
  }),
);

router.get(
  "/widgets",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { getEmployeeDashboardWidgets, getAdminDashboardWidgets } = await import(
      "../services/dashboardWidgetsService.js"
    );
    if (req.user.role === "admin") {
      res.json(await getAdminDashboardWidgets());
    } else {
      res.json(await getEmployeeDashboardWidgets(req.user));
    }
  }),
);

export default router;
