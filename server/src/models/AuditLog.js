import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: true, field: "user_id" },
    userName: { type: DataTypes.STRING(120), allowNull: false, field: "user_name" },
    action: { type: DataTypes.STRING(80), allowNull: false },
    resource: { type: DataTypes.STRING(80), allowNull: false },
    resourceId: { type: DataTypes.STRING(64), allowNull: true, field: "resource_id" },
    details: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "audit_logs", updatedAt: false },
);
