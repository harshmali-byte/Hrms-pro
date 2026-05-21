import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const LeavePolicy = sequelize.define(
  "LeavePolicy",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    type: {
      type: DataTypes.ENUM("casual", "sick", "earned", "unpaid"),
      allowNull: false,
    },
    daysPerYear: { type: DataTypes.INTEGER, allowNull: false, field: "days_per_year" },
    carryForwardLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "carry_forward_limit",
    },
    isPaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_paid" },
    minNoticeDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "min_notice_days",
    },
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "requires_approval",
    },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "leave_policies" },
);
