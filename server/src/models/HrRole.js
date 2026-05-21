import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const HrRole = sequelize.define(
  "HrRole",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    name: { type: DataTypes.STRING(80), allowNull: false },
    slug: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    permissions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    isSystem: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_system" },
  },
  { tableName: "hr_roles" },
);
