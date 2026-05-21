import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import "./models/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import leaveRoutes from "./routes/leave.js";
import attendanceRoutes from "./routes/attendance.js";
import notificationRoutes from "./routes/notifications.js";
import payrollRoutes from "./routes/payroll.js";
import dashboardRoutes from "./routes/dashboard.js";
import bootstrapRoutes from "./routes/bootstrap.js";
import adminRoutes from "./routes/admin.js";
import configRoutes from "./routes/config.js";
import contentRoutes from "./routes/content.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "hrms-pro-api", version: "2.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bootstrap", bootstrapRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/config", configRoutes);
app.use("/api/content", contentRoutes);

app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.DB_ALTER === "true" });
    console.log("PostgreSQL connected");
  } catch (e) {
    console.error("Database connection failed:", e.message);
    console.error("Start PostgreSQL and run: npm run db:seed");
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`HRMS API listening on http://0.0.0.0:${port}`);
  });
}

start();
