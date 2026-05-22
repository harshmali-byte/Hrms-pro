export type HubstaffSyncStatus = "synced" | "syncing" | "offline";

export interface HubstaffSummary {
  trackedToday: string;
  activityPercent: number;
  idleMinutes: number;
  keyboardMousePerHour: number;
  topProject: string;
  topApp: string;
  screenshotsToday: number;
  weekTracked: string;
  lastSyncedLabel: string;
  syncStatus: HubstaffSyncStatus;
  isTracking: boolean;
  /** live API vs HRMS-derived demo */
  source?: "hubstaff" | "demo" | "error";
  configured?: boolean;
  message?: string;
  liveFromHubstaff?: boolean;
  pollIntervalMs?: number;
}

export interface HubstaffSummaryResponse extends Partial<HubstaffSummary> {
  configured?: boolean;
  source?: "hubstaff" | "demo" | "error";
  message?: string;
  pollIntervalMs?: number;
}
