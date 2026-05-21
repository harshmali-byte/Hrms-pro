import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const OrgPreferences = sequelize.define(
  "OrgPreferences",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true, defaultValue: "default" },
    locale: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "en-IN" },
    country: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "India" },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "INR" },
    timezone: { type: DataTypes.STRING(48), allowNull: false, defaultValue: "Asia/Kolkata" },
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
    leaveReminders: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "leave_reminders",
    },
    payrollAlerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "payroll_alerts",
    },
    policyUpdates: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "policy_updates",
    },
  },
  { tableName: "org_preferences" },
);
