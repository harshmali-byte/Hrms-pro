import "dotenv/config";
import { sequelize } from "../config/database.js";
import "../models/index.js";

await sequelize.sync({ alter: true });
console.log("Tables synced");
process.exit(0);
