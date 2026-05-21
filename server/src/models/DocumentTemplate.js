import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const DocumentTemplate = sequelize.define(
  "DocumentTemplate",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    category: {
      type: DataTypes.ENUM("offer", "policy", "letter", "form", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    version: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "1.0" },
    updatedAtLabel: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "updated_at_label",
    },
  },
  { tableName: "document_templates", updatedAt: true, createdAt: true },
);
