import { AppError } from "../utils/errors.js";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err?.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "Record already exists" });
  }
  if (err?.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors?.[0]?.message ?? "Validation failed" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
