import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const secret = process.env.JWT_SECRET || "hrms-dev-secret";

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      employeeId: user.employeeId,
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: "7d" },
  );
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(header.slice(7), secret);
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}
