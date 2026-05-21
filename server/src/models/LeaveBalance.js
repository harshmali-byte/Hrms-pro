import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const LeaveBalance = sequelize.define(
  "LeaveBalance",
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
    type: {
      type: DataTypes.ENUM("casual", "sick", "earned", "unpaid"),
      allowNull: false,
    },
    total: { type: DataTypes.INTEGER, allowNull: false },
    used: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "leave_balances",
    indexes: [{ unique: true, fields: ["employee_id", "type"] }],
  },
);
