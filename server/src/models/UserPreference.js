import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const UserPreference = sequelize.define(
  "UserPreference",
  {
    employeeId: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      field: "employee_id",
    },
    language: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: "English",
    },
    timezone: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "Asia/Kolkata",
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "email_notifications",
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "push_notifications",
    },
    compactMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "compact_mode",
    },
  },
  { tableName: "user_preferences", updatedAt: true, createdAt: true },
);
