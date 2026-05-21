import "dotenv/config";
import { sequelize } from "../config/database.js";
import "../models/index.js";
import { seedConfigData } from "./seedConfig.js";

await sequelize.authenticate();
await sequelize.sync({ alter: true });
await seedConfigData();
console.log("Configuration tables synced and seeded.");
process.exit(0);
