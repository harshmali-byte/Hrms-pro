import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/errors.js";
import { logAudit } from "../services/auditLog.js";

const router = Router();

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        employeeId: req.user.employeeId,
      },
    });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password required");
    }
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) throw new AppError("Invalid email or password", 401);
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError("Invalid email or password", 401);

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  }),
);

router.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await logAudit(req, {
      action: "logout",
      resource: "auth",
      details: `${req.user.name} signed out`,
    });
    res.json({ ok: true });
  }),
);

export default router;
