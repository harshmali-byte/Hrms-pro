import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAtLabel: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "created_at_label",
    },
  },
  { tableName: "notifications", updatedAt: false },
);
