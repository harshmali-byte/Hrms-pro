import { Router } from "express";
import { Announcement, Holiday, DocumentTemplate } from "../models/index.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { formatPostedDate, newId } from "../utils/dates.js";
import { logAudit } from "../services/auditLog.js";

const router = Router();

router.get(
  "/announcements",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const rows = await Announcement.findAll({ order: [["postedOn", "DESC"]] });
    res.json(
      rows.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        postedBy: a.postedBy,
        postedOn: a.postedOn,
        tag: a.tag,
      })),
    );
  }),
);

router.post(
  "/announcements",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { title, body, tag, postedBy } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ error: "Title and body required" });
    }
    const row = await Announcement.create({
      id: newId("AN"),
      title: title.trim(),
      body: body.trim(),
      postedBy: postedBy?.trim() || req.user.name,
      postedOn: formatPostedDate(),
      tag: tag || "general",
    });
    await logAudit(req, {
      action: "create",
      resource: "announcement",
      resourceId: row.id,
      details: row.title,
    });
    res.status(201).json({
      id: row.id,
      title: row.title,
      body: row.body,
      postedBy: row.postedBy,
      postedOn: row.postedOn,
      tag: row.tag,
    });
  }),
);

router.get(
  "/templates",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const rows = await DocumentTemplate.findAll({ order: [["name", "ASC"]] });
    res.json(
      rows.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        version: t.version,
        updatedAt: t.updatedAtLabel,
      })),
    );
  }),
);

router.get(
  "/holidays",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const rows = await Holiday.findAll({ order: [["date", "ASC"]] });
    res.json(
      rows.map((h) => ({
        id: h.id,
        date: h.date,
        name: h.name,
        type: h.type,
      })),
    );
  }),
);

export default router;
