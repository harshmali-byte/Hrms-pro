import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const LeaveRequest = sequelize.define(
  "LeaveRequest",
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
    employeeName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "employee_name",
    },
    type: {
      type: DataTypes.ENUM("casual", "sick", "earned", "unpaid"),
      allowNull: false,
    },
    from: { type: DataTypes.STRING(32), allowNull: false },
    to: { type: DataTypes.STRING(32), allowNull: false },
    days: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    appliedOn: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "applied_on",
    },
  },
  { tableName: "leave_requests" },
);
