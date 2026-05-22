import { apiFetch } from "./client";
import type { HubstaffSummaryResponse } from "@/types/hubstaff";

export async function fetchHubstaffSummary(): Promise<HubstaffSummaryResponse> {
  return apiFetch<HubstaffSummaryResponse>("/hubstaff/summary");
}

export async function fetchHubstaffStatus(): Promise<{
  configured: boolean;
  orgId: string | null;
}> {
  return apiFetch("/hubstaff/status");
}
