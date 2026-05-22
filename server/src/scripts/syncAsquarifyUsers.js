import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User, Employee } from "../models/index.js";
import {
  ASQUARIFY_EMPLOYEES,
  DEMO_AUTH_USERS,
  DEMO_PASSWORD,
  LEGACY_DEMO_EMAILS,
} from "../data/asquarifyTeam.js";

/**
 * Upsert Asquarify team + demo logins without wiping the whole database.
 * Run after pulling new seed data when `db:seed` skips because rows exist.
 */
export async function syncAsquarifyUsers() {
  for (const emp of ASQUARIFY_EMPLOYEES) {
    await Employee.upsert(emp);
  }

  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const demo of DEMO_AUTH_USERS) {
    const email = demo.email.trim().toLowerCase();
    let user = await User.findOne({ where: { email } });
    if (user) {
      await user.update({
        passwordHash: hash,
        role: demo.role,
        employeeId: demo.employeeId,
        name: demo.name,
      });
    } else {
      user = await User.create({
        email,
        passwordHash: hash,
        role: demo.role,
        employeeId: demo.employeeId,
        name: demo.name,
      });
    }
  }

  await User.destroy({
    where: { email: { [Op.in]: LEGACY_DEMO_EMAILS } },
  });

  console.log("Asquarify users synced:");
  for (const d of DEMO_AUTH_USERS) {
    console.log(`  ${d.role}: ${d.email} / ${DEMO_PASSWORD}`);
  }
}
