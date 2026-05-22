import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PrivacyPreference = sequelize.define(
  "PrivacyPreference",
  {
    employeeId: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      field: "employee_id",
    },
    profileVisibility: {
      type: DataTypes.ENUM("team", "managers", "private"),
      allowNull: false,
      defaultValue: "team",
      field: "profile_visibility",
    },
    shareBirthday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "share_birthday",
    },
    sharePhone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "share_phone",
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "two_factor_enabled",
    },
  },
  { tableName: "privacy_preferences", updatedAt: true, createdAt: true },
);
