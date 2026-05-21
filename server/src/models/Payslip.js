import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Payslip = sequelize.define(
  "Payslip",
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
    month: { type: DataTypes.STRING(20), allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    gross: { type: DataTypes.INTEGER, allowNull: false },
    deductions: { type: DataTypes.INTEGER, allowNull: false },
    net: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("paid", "processing"),
      allowNull: false,
    },
  },
  { tableName: "payslips" },
);
