/**
 * Hubstaff Time Tracking API v2 — server-side sync.
 * @see https://developer.hubstaff.com/docs/hubstaff_v2
 * @see https://developer.hubstaff.com/authentication#pat
 */

const TOKEN_URL = "https://account.hubstaff.com/access_tokens";
const API_BASE = "https://api.hubstaff.com/v2";

/** @type {{ accessToken: string | null, refreshToken: string | null, expiresAt: number }} */
const tokenCache = {
  accessToken: null,
  refreshToken: process.env.HUBSTAFF_REFRESH_TOKEN?.trim() || null,
  expiresAt: 0,
};

/** @type {Map<string, { data: unknown, expiresAt: number }>} */
const responseCache = new Map();
const CACHE_MS = 25_000;

function isConfigured() {
  return Boolean(tokenCache.refreshToken);
}

function cacheGet(key) {
  const hit = responseCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data;
  return null;
}

function cacheSet(key, data, ttl = CACHE_MS) {
  responseCache.set(key, { data, expiresAt: Date.now() + ttl });
}

function formatDuration(seconds) {
  const totalMin = Math.max(0, Math.floor(Number(seconds) / 60));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function todayUtcDate() {
  return new Date().toISOString().slice(0, 10);
}

function weekStartDate() {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

async function exchangeRefreshToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error_description || json.error || `Hubstaff token error ${res.status}`);
  }

  tokenCache.accessToken = json.access_token;
  tokenCache.refreshToken = json.refresh_token || refreshToken;
  const expiresIn = Number(json.expires_in) || 3600;
  tokenCache.expiresAt = Date.now() + expiresIn * 1000 - 60_000;
  return tokenCache.accessToken;
}

async function getAccessToken() {
  if (!tokenCache.refreshToken) return null;
  if (tokenCache.accessToken && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }
  return exchangeRefreshToken(tokenCache.refreshToken);
}

async function hubstaffFetch(path, query = {}) {
  const token = await getAccessToken();
  if (!token) return null;

  const qs = new URLSearchParams(query).toString();
  const url = `${API_BASE}${path}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401) {
    tokenCache.accessToken = null;
    tokenCache.expiresAt = 0;
    const retryToken = await getAccessToken();
    if (!retryToken) throw new Error("Hubstaff authentication failed");
    const retry = await fetch(url, {
      headers: { Authorization: `Bearer ${retryToken}`, Accept: "application/json" },
    });
    if (!retry.ok) {
      const err = await retry.json().catch(() => ({}));
      throw new Error(err.error || `Hubstaff API ${retry.status}`);
    }
    return retry.json();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Hubstaff API ${res.status}`);
  }

  return res.json();
}

async function resolveOrganizationId() {
  const envOrg = process.env.HUBSTAFF_ORG_ID?.trim();
  if (envOrg) return envOrg;

  const cached = cacheGet("org_id");
  if (cached) return cached;

  const data = await hubstaffFetch("/organizations");
  const orgs = data?.organizations ?? [];
  const active = orgs.find((o) => o.status === "active") ?? orgs[0];
  if (!active?.id) throw new Error("No Hubstaff organization found");
  cacheSet("org_id", String(active.id), 3600_000);
  return String(active.id);
}

/** @param {string} orgId */
async function loadMembers(orgId) {
  const cacheKey = `members_${orgId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const members = [];
  let page = 1;
  for (let i = 0; i < 10; i += 1) {
    const data = await hubstaffFetch(`/organizations/${orgId}/members`, {
      page: String(page),
      per_page: "100",
    });
    const batch = data?.members ?? data?.organization_members ?? [];
    members.push(...batch);
    if (!batch.length || batch.length < 100) break;
    page += 1;
  }

  cacheSet(cacheKey, members, 300_000);
  return members;
}

/** @param {string} orgId */
async function loadProjects(orgId) {
  const cacheKey = `projects_${orgId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const data = await hubstaffFetch(`/organizations/${orgId}/projects`);
  const projects = data?.projects ?? [];
  const map = new Map(projects.map((p) => [String(p.id), p.name ?? `Project ${p.id}`]));
  cacheSet(cacheKey, map, 600_000);
  return map;
}

/**
 * @param {string} email
 * @returns {Promise<number | null>}
 */
async function findHubstaffUserIdByEmail(email) {
  const orgId = await resolveOrganizationId();
  const members = await loadMembers(orgId);
  const needle = email.trim().toLowerCase();

  for (const m of members) {
    const userEmail = (m.email ?? m.user?.email ?? "").toLowerCase();
    if (userEmail === needle) return Number(m.user_id ?? m.user?.id ?? m.id);
  }

  const usersData = await hubstaffFetch("/users", { search: email });
  const users = usersData?.users ?? [];
  const hit = users.find((u) => (u.email ?? "").toLowerCase() === needle);
  return hit?.id ? Number(hit.id) : null;
}

/**
 * Recent raw activities — used to detect live desktop timer.
 * @param {string} orgId
 * @param {number} hubstaffUserId
 */
async function fetchRecentActivities(orgId, hubstaffUserId) {
  const today = todayUtcDate();
  const data = await hubstaffFetch(`/organizations/${orgId}/activities`, {
    "date[start]": today,
    "date[stop]": today,
    user_ids: String(hubstaffUserId),
  });
  return data?.activities ?? [];
}

/**
 * @param {string} orgId
 * @param {number} hubstaffUserId
 */
async function fetchDailyActivities(orgId, hubstaffUserId) {
  const today = todayUtcDate();
  const data = await hubstaffFetch(`/organizations/${orgId}/activities/daily`, {
    "date[start]": today,
    "date[stop]": today,
    user_ids: String(hubstaffUserId),
  });
  const rows = data?.daily_activities ?? data?.activities ?? [];
  return rows.filter((r) => Number(r.user_id) === hubstaffUserId);
}

/**
 * @param {string} orgId
 * @param {number} hubstaffUserId
 */
async function fetchWeekTrackedSeconds(orgId, hubstaffUserId) {
  const start = weekStartDate();
  const stop = todayUtcDate();
  const data = await hubstaffFetch(`/organizations/${orgId}/activities/daily`, {
    "date[start]": start,
    "date[stop]": stop,
    user_ids: String(hubstaffUserId),
  });
  const rows = data?.daily_activities ?? data?.activities ?? [];
  return rows
    .filter((r) => Number(r.user_id) === hubstaffUserId)
    .reduce((sum, r) => sum + Number(r.tracked ?? r.tracked_seconds ?? 0), 0);
}

function aggregateDailyRows(rows) {
  let tracked = 0;
  let keyboard = 0;
  let mouse = 0;
  let idle = 0;
  let activitySum = 0;
  let activityWeight = 0;
  let screenshots = 0;
  /** @type {Map<string, number>} */
  const projectSeconds = new Map();

  for (const r of rows) {
    const t = Number(r.tracked ?? r.tracked_seconds ?? 0);
    tracked += t;
    keyboard += Number(r.keyboard ?? r.keyboard_seconds ?? 0);
    mouse += Number(r.mouse ?? r.mouse_seconds ?? 0);
    idle += Number(r.idle ?? r.idle_time ?? r.idle_seconds ?? 0);
    screenshots += Number(r.screenshots ?? r.screenshot_count ?? 0);

    const act = Number(r.overall ?? r.overall_activity ?? r.activity ?? 0);
    if (t > 0 && act > 0) {
      activitySum += act * t;
      activityWeight += t;
    }

    const pid = r.project_id != null ? String(r.project_id) : null;
    if (pid && t > 0) {
      projectSeconds.set(pid, (projectSeconds.get(pid) ?? 0) + t);
    }
  }

  const activityPercent =
    activityWeight > 0
      ? Math.round(activitySum / activityWeight)
      : tracked > 0
        ? 65
        : 0;

  let topProjectId = null;
  let topSecs = 0;
  for (const [pid, secs] of projectSeconds) {
    if (secs > topSecs) {
      topSecs = secs;
      topProjectId = pid;
    }
  }

  return {
    trackedSeconds: tracked,
    activityPercent,
    idleSeconds: idle,
    keyboard,
    mouse,
    screenshots,
    topProjectId,
  };
}

function detectLiveTracking(activities) {
  if (!activities?.length) return false;
  const now = Date.now();
  const sorted = [...activities].sort((a, b) => {
    const ta = new Date(a.starts_at ?? a.start ?? a.created_at ?? 0).getTime();
    const tb = new Date(b.starts_at ?? b.start ?? b.created_at ?? 0).getTime();
    return tb - ta;
  });
  const latest = sorted[0];
  if (!latest) return false;

  const startMs = new Date(latest.starts_at ?? latest.start ?? latest.created_at ?? 0).getTime();
  const tracked = Number(latest.tracked ?? latest.tracked_seconds ?? 0);
  const ageMs = now - startMs;

  // Desktop timer: recent slot with tracked time still growing (within 15 min window)
  return ageMs >= 0 && ageMs < 15 * 60 * 1000 && tracked > 0;
}

/**
 * @param {{ email: string, hrmsCheckedIn?: boolean }} opts
 */
export async function getHubstaffSummaryForUser({ email, hrmsCheckedIn = false }) {
  if (!isConfigured()) {
    return {
      configured: false,
      source: "demo",
      message: "Add HUBSTAFF_REFRESH_TOKEN to server/.env (see README).",
    };
  }

  try {
    const orgId = await resolveOrganizationId();
    const hubstaffUserId = await findHubstaffUserIdByEmail(email);

    if (!hubstaffUserId) {
      return {
        configured: true,
        source: "demo",
        message: `No Hubstaff member matched ${email}. Use the same work email in Hubstaff.`,
      };
    }

    const [dailyRows, recentActivities, weekSeconds, projectMap] = await Promise.all([
      fetchDailyActivities(orgId, hubstaffUserId),
      fetchRecentActivities(orgId, hubstaffUserId),
      fetchWeekTrackedSeconds(orgId, hubstaffUserId),
      loadProjects(orgId),
    ]);

    const agg = aggregateDailyRows(dailyRows);
    const liveFromApi = detectLiveTracking(recentActivities);
    const isTracking = liveFromApi || hrmsCheckedIn;

    const topProject = agg.topProjectId
      ? projectMap.get(agg.topProjectId) ?? "Asquarify's Project"
      : "—";

    const inputPerHour =
      agg.trackedSeconds > 0
        ? Math.round(((agg.keyboard + agg.mouse) / agg.trackedSeconds) * 3600)
        : 0;

    return {
      configured: true,
      source: "hubstaff",
      hubstaffUserId,
      trackedToday: formatDuration(agg.trackedSeconds),
      trackedSeconds: agg.trackedSeconds,
      activityPercent: agg.activityPercent,
      idleMinutes: Math.max(0, Math.round(agg.idleSeconds / 60)),
      keyboardMousePerHour: inputPerHour,
      topProject,
      topApp: isTracking ? "Hubstaff desktop · active" : "—",
      screenshotsToday: agg.screenshots,
      weekTracked: formatDuration(weekSeconds),
      lastSyncedLabel: "Just now",
      syncStatus: "synced",
      isTracking,
      liveFromHubstaff: liveFromApi,
      pollIntervalMs: 30_000,
    };
  } catch (e) {
    return {
      configured: true,
      source: "error",
      message: e instanceof Error ? e.message : "Hubstaff sync failed",
      syncStatus: "offline",
      isTracking: hrmsCheckedIn,
      pollIntervalMs: 60_000,
    };
  }
}

export function getHubstaffStatus() {
  return {
    configured: isConfigured(),
    orgId: process.env.HUBSTAFF_ORG_ID?.trim() || null,
  };
}
