import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Holiday = sequelize.define(
  "Holiday",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    date: { type: DataTypes.STRING(32), allowNull: false },
    name: { type: DataTypes.STRING(160), allowNull: false },
    type: {
      type: DataTypes.ENUM("public", "optional"),
      allowNull: false,
      defaultValue: "public",
    },
  },
  { tableName: "holidays" },
);
