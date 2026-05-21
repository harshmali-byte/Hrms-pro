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

export default router;
