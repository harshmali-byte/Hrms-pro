import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { buildBootstrapState } from "../services/bootstrapService.js";

const router = Router();

router.get(
  "/state",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await buildBootstrapState(req.user));
  }),
);

export default router;
