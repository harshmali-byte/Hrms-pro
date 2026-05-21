import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/hrms_pro";

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});
