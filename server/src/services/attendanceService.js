import { Op } from "sequelize";
import { AttendanceDay } from "../models/index.js";
import { AppError } from "../utils/errors.js";
import { todayKey } from "../utils/dates.js";
import { pushNotification } from "./notifications.js";
import { logAudit } from "./auditLog.js";

function segmentsToRecord(dateKey, segments) {
  if (!segments?.length) return null;

  const first = segments[0];
  const last = segments[segments.length - 1];
  const now = Date.now();
  let workedMs = 0;
  for (const s of segments) {
    workedMs += (s.out ?? now) - s.in;
  }
  const hours = Math.round((workedMs / 3600000) * 10) / 10;

  const fmt = (ts) =>
    new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const [, m, d] = dateKey.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateLabel = `${Number(d)} ${months[Number(m) - 1]}`;

  return {
    date: dateLabel,
    dateKey,
    checkIn: fmt(first.in),
    checkOut: last.out ? fmt(last.out) : "—",
    hours,
    status: "present",
  };
}

async function getOrCreateDay(employeeId, dateKey) {
  let row = await AttendanceDay.findOne({ where: { employeeId, dateKey } });
  if (!row) {
    row = await AttendanceDay.create({ employeeId, dateKey, segments: [] });
  }
  return row;
}

export async function getTodayAttendance(employeeId) {
  const dateKey = todayKey();
  if (!employeeId) return { dateKey, segments: [] };
  const row = await AttendanceDay.findOne({ where: { employeeId, dateKey } });
  return { dateKey, segments: row?.segments ?? [] };
}

export async function saveTodayAttendance(employeeId, data) {
  if (!employeeId) throw new AppError("Employee profile required", 403);
  const key = data.dateKey || todayKey();
  const row = await getOrCreateDay(employeeId, key);
  row.segments = Array.isArray(data.segments) ? data.segments : [];
  await row.save();
  return { dateKey: row.dateKey, segments: row.segments };
}

export async function clockIn(req, user) {
  const employeeId = user.employeeId;
  if (!employeeId) throw new AppError("Employee profile required", 403);

  const dateKey = todayKey();
  const row = await getOrCreateDay(employeeId, dateKey);
  let segments = row.segments || [];
  const last = segments[segments.length - 1];
  if (last?.out === null) return { dateKey, segments };

  segments = [...segments, { in: Date.now(), out: null }];
  row.segments = segments;
  await row.save();

  const t = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  await pushNotification(user.id, "Checked in", `Clock-in recorded at ${t}.`);
  await logAudit(req, {
    action: "clock_in",
    resource: "attendance",
    resourceId: dateKey,
    details: `Clock-in at ${t}`,
  });

  return { dateKey, segments };
}

export async function clockOut(req, user) {
  const employeeId = user.employeeId;
  if (!employeeId) throw new AppError("Employee profile required", 403);

  const dateKey = todayKey();
  const row = await getOrCreateDay(employeeId, dateKey);
  let segments = row.segments || [];
  const last = segments[segments.length - 1];
  if (!last || last.out !== null) return { dateKey, segments };

  segments = [...segments];
  segments[segments.length - 1] = { ...last, out: Date.now() };
  row.segments = segments;
  await row.save();

  await pushNotification(user.id, "Checked out", "Your work session was saved for today.");
  await logAudit(req, {
    action: "clock_out",
    resource: "attendance",
    resourceId: dateKey,
    details: "Clock-out recorded",
  });

  return { dateKey, segments };
}

export async function getAttendanceHistory(employeeId, days = 14) {
  if (!employeeId) return [];

  const rows = await AttendanceDay.findAll({
    where: {
      employeeId,
      dateKey: { [Op.ne]: todayKey() },
    },
    order: [["dateKey", "DESC"]],
    limit: days,
  });

  const history = [];
  for (const row of rows) {
    const rec = segmentsToRecord(row.dateKey, row.segments);
    if (rec) history.push(rec);
  }

  return history;
}

export async function getAttendanceTrend() {
  const rows = await AttendanceDay.findAll({
    order: [["dateKey", "ASC"]],
    limit: 200,
  });

  const byDate = new Map();
  for (const r of rows) {
    const rec = segmentsToRecord(r.dateKey, r.segments);
    if (!rec) continue;
    const cur = byDate.get(r.dateKey) ?? { present: 0, absent: 0 };
    cur.present += 1;
    byDate.set(r.dateKey, cur);
  }

  const keys = [...byDate.keys()].slice(-7);
  const labels = keys.map((k) => {
    const [, m, d] = k.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${Number(d)} ${months[Number(m) - 1]}`;
  });

  return {
    labels: labels.length ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    present: keys.map((k) => byDate.get(k)?.present ?? 0),
    absent: keys.map(() => 0),
  };
}

export { segmentsToRecord };
