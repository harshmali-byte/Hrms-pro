import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Notice = sequelize.define(
  "Notice",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    dateLabel: { type: DataTypes.STRING(32), allowNull: false, field: "date_label" },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
  },
  { tableName: "notices" },
);
