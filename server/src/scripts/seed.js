import "dotenv/config";
import { sequelize } from "../config/database.js";
import "../models/index.js";
import { seedDatabase } from "./seedData.js";

const force = process.argv.includes("--force");

async function main() {
  try {
    await sequelize.authenticate();
    await seedDatabase({ force });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
