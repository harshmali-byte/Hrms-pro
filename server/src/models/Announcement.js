import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Announcement = sequelize.define(
  "Announcement",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    postedBy: { type: DataTypes.STRING(120), allowNull: false, field: "posted_by" },
    postedOn: { type: DataTypes.STRING(32), allowNull: false, field: "posted_on" },
    tag: {
      type: DataTypes.ENUM("policy", "event", "celebration", "general", "project"),
      allowNull: false,
      defaultValue: "general",
    },
  },
  { tableName: "announcements" },
);
