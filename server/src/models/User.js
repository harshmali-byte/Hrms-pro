import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    role: {
      type: DataTypes.ENUM("employee", "admin"),
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: "employee_id",
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
  },
  { tableName: "users" },
);
