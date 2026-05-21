import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AttendanceDay = sequelize.define(
  "AttendanceDay",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "employee_id",
    },
    dateKey: {
      type: DataTypes.STRING(16),
      allowNull: false,
      field: "date_key",
    },
    segments: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "attendance_days",
    indexes: [{ unique: true, fields: ["employee_id", "date_key"] }],
  },
);
