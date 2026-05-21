export type AttendanceSegment = { in: number; out: number | null };

export function totalWorkedMs(segments: AttendanceSegment[], nowMs: number): number {
  return segments.reduce((acc, s) => {
    const end = s.out ?? nowMs;
    return acc + Math.max(0, end - s.in);
  }, 0);
}

export function formatDurationHhMm(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDurationHuman(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/** Hours with one decimal for AttendanceRecord-style stats. */
export function msToHoursOneDecimal(ms: number): number {
  return Math.round((ms / 3600000) * 10) / 10;
}
