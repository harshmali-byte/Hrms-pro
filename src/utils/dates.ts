/** Calendar day key in local timezone (YYYY-MM-DD). */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** e.g. "16 May" — matches dummy history list style. */
export function shortDayLabel(d = new Date()): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatTimeHm(d: Date): string {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatPostedDate(d = new Date()): string {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Matches dummy leave date strings, e.g. "16 May 2026". */
export function formatLeaveFormDate(d = new Date()): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
