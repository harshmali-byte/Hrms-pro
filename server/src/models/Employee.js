import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
    role: { type: DataTypes.STRING(120), allowNull: false },
    department: { type: DataTypes.STRING(80), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(32), allowNull: false },
    avatarColor: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: "avatar_color",
    },
    joinedOn: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "joined_on",
    },
    reportsTo: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "reports_to",
    },
    status: {
      type: DataTypes.ENUM("active", "onLeave", "probation"),
      allowNull: false,
      defaultValue: "active",
    },
    location: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: "Bengaluru, IN",
    },
    employeeCode: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: "employee_code",
    },
  },
  { tableName: "employees" },
);
