import { Notification } from "../models/index.js";
import { formatPostedDate, newId } from "../utils/dates.js";

export async function pushNotification(userId, title, body) {
  return Notification.create({
    id: newId("N"),
    userId,
    title,
    body,
    read: false,
    createdAtLabel: formatPostedDate(),
  });
}

export async function pushForRole(role, title, body, { User }) {
  const users = await User.findAll({ where: { role } });
  await Promise.all(users.map((u) => pushNotification(u.id, title, body)));
}
