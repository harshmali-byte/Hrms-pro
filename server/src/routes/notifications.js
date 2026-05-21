import { Router } from "express";
import { Notification } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notificationToJson } from "../utils/serializers.js";
import { assertFound } from "../utils/errors.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(rows.map(notificationToJson));
  }),
);

router.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req, res) => {
    const row = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    assertFound(row, "Notification");
    row.read = true;
    await row.save();
    res.json({ ok: true });
  }),
);

router.patch(
  "/read-all",
  requireAuth,
  asyncHandler(async (req, res) => {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } },
    );
    res.json({ ok: true });
  }),
);

export default router;
