import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EmployeeDocument = sequelize.define(
  "EmployeeDocument",
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
    title: { type: DataTypes.STRING(140), allowNull: false },
    category: {
      type: DataTypes.ENUM("identity", "employment", "payroll", "education", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "file_url",
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "employee_documents", updatedAt: true, createdAt: true },
);
