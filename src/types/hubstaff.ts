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
}
