import type { AttendanceSegment } from "@/utils/attendance";
import { formatDurationHuman, totalWorkedMs } from "@/utils/attendance";
import type { HubstaffSummary, HubstaffSummaryResponse } from "@/types/hubstaff";

const TARGET_MS = 8 * 60 * 60 * 1000;

/** Fallback when Hubstaff API is not configured or user not linked. */
export function buildHubstaffSummary(
  segments: AttendanceSegment[],
  isCheckedIn: boolean,
  nowMs: number,
): HubstaffSummary {
  const workedMs = totalWorkedMs(segments, nowMs);
  const trackedMs = Math.round(workedMs * 0.94);
  const activityPercent = isCheckedIn
    ? Math.min(96, 68 + Math.floor((workedMs / TARGET_MS) * 28))
    : segments.length > 0
      ? Math.min(88, 55 + Math.floor((workedMs / TARGET_MS) * 30))
      : 0;

  const idleMinutes = isCheckedIn
    ? Math.max(2, Math.floor((1 - activityPercent / 100) * 18))
    : Math.floor((1 - activityPercent / 100) * 45);

  const weekHours = 32 + workedMs / 3600000;
  const weekH = Math.floor(weekHours);
  const weekM = Math.round((weekHours - weekH) * 60);

  return {
    trackedToday: formatDurationHuman(trackedMs),
    activityPercent,
    idleMinutes,
    keyboardMousePerHour: isCheckedIn ? 420 + (segments.length % 3) * 40 : 180,
    topProject: segments.length > 0 ? "Ne Family" : "Asquarify HRMS",
    topApp: isCheckedIn ? "Cursor · VS Code" : "—",
    screenshotsToday: Math.max(0, Math.floor(trackedMs / 480000)),
    weekTracked: `${weekH}h ${weekM}m`,
    lastSyncedLabel: isCheckedIn ? "Just now" : segments.length > 0 ? "2 min ago" : "Not synced",
    syncStatus: segments.length > 0 ? "synced" : "offline",
    isTracking: isCheckedIn,
    source: "demo",
    configured: false,
  };
}

export function mergeHubstaffResponse(
  remote: HubstaffSummaryResponse,
  fallback: HubstaffSummary,
): HubstaffSummary {
  if (remote.source === "hubstaff" && remote.trackedToday) {
    return {
      trackedToday: remote.trackedToday,
      activityPercent: remote.activityPercent ?? 0,
      idleMinutes: remote.idleMinutes ?? 0,
      keyboardMousePerHour: remote.keyboardMousePerHour ?? 0,
      topProject: remote.topProject ?? "—",
      topApp: remote.topApp ?? "—",
      screenshotsToday: remote.screenshotsToday ?? 0,
      weekTracked: remote.weekTracked ?? "0m",
      lastSyncedLabel: remote.lastSyncedLabel ?? "Just now",
      syncStatus: remote.syncStatus ?? "synced",
      isTracking: remote.isTracking ?? false,
      source: "hubstaff",
      configured: true,
      liveFromHubstaff: remote.liveFromHubstaff,
      pollIntervalMs: remote.pollIntervalMs ?? 30_000,
      message: remote.message,
    };
  }

  if (remote.source === "error") {
    return {
      ...fallback,
      syncStatus: "offline",
      message: remote.message,
      configured: remote.configured ?? true,
      source: "error",
    };
  }

  return {
    ...fallback,
    message: remote.message ?? fallback.message,
    configured: remote.configured ?? false,
    source: remote.source ?? "demo",
  };
}

export function dailyTargetProgress(segments: AttendanceSegment[], nowMs: number): number {
  const worked = totalWorkedMs(segments, nowMs);
  return Math.min(100, Math.round((worked / TARGET_MS) * 100));
}

export const HUBSTAFF_APP_URL = "https://app.hubstaff.com/";
