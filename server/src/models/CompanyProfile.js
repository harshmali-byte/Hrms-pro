import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const CompanyProfile = sequelize.define(
  "CompanyProfile",
  {
    id: { type: DataTypes.STRING(32), primaryKey: true, defaultValue: "default" },
    legalName: { type: DataTypes.STRING(200), allowNull: false, field: "legal_name" },
    displayName: { type: DataTypes.STRING(120), allowNull: false, field: "display_name" },
    address: { type: DataTypes.TEXT, allowNull: false },
    country: { type: DataTypes.STRING(80), allowNull: false },
    industry: { type: DataTypes.STRING(80), allowNull: false },
    website: { type: DataTypes.STRING(200), allowNull: true },
    taxId: { type: DataTypes.STRING(64), allowNull: true, field: "tax_id" },
  },
  { tableName: "company_profiles" },
);
