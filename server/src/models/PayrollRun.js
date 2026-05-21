import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PayrollRun = sequelize.define(
  "PayrollRun",
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      defaultValue: "default",
    },
    runStatus: {
      type: DataTypes.ENUM("In progress", "Locked"),
      allowNull: false,
      defaultValue: "In progress",
      field: "run_status",
    },
    steps: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  { tableName: "payroll_runs" },
);
