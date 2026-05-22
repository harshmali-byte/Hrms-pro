import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const SupportTicket = sequelize.define(
  "SupportTicket",
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "employee_id",
    },
    subject: { type: DataTypes.STRING(160), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "resolved", "closed"),
      allowNull: false,
      defaultValue: "open",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },
  },
  { tableName: "support_tickets", updatedAt: true, createdAt: true },
);
