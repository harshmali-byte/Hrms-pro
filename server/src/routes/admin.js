import { Router } from "express";
import { sequelize } from "../models/index.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post(
  "/reset-demo",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const { seedDatabase } = await import("../scripts/seedHrData.js");
    await seedDatabase({ force: true });
    res.json({ ok: true, message: "Database re-seeded" });
  }),
);

router.get(
  "/health-db",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    await sequelize.authenticate();
    res.json({ ok: true });
  }),
);

export default router;
