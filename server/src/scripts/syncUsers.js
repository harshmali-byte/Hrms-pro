import "dotenv/config";
import { sequelize } from "../config/database.js";
import "../models/index.js";
import { syncAsquarifyUsers } from "./syncAsquarifyUsers.js";

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await syncAsquarifyUsers();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
