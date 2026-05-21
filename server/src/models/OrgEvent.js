import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const OrgEvent = sequelize.define(
  "OrgEvent",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    whenLabel: { type: DataTypes.STRING(120), allowNull: false, field: "when_label" },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
  },
  { tableName: "org_events" },
);
