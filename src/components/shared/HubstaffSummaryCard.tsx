import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import {
  Activity,
  Camera,
  ExternalLink,
  Keyboard,
  Monitor,
  RefreshCw,
  Timer,
} from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchHubstaffSummary } from "@/api/hubstaffApi";
import { useHrmsData } from "@/context/HrmsDataContext";
import {
  buildHubstaffSummary,
  HUBSTAFF_APP_URL,
  mergeHubstaffResponse,
} from "@/utils/hubstaff";
import type { HubstaffSummary } from "@/types/hubstaff";

const HUBSTAFF_GREEN = "#2EB67D";
const DEFAULT_POLL_MS = 30_000;

interface MetricProps {
  label: string;
  value: string;
  icon: typeof Timer;
  accent?: string;
}

function Metric({ label, value, icon: Icon, accent = HUBSTAFF_GREEN }: MetricProps) {
  return (
    <View className="min-w-[96px] flex-1 rounded-xl border border-border bg-surfaceMuted px-3 py-3">
      <View
        className="mb-2 h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon size={iconSizes.sm} color={accent} />
      </View>
      <Text style={{ fontFamily: font.bold }} className="text-lg text-text">
        {value}
      </Text>
      <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-xs text-textMuted">
        {label}
      </Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-border py-2.5 last:border-b-0">
      <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
        {label}
      </Text>
      <Text
        style={{ fontFamily: font.semibold }}
        className="max-w-[58%] text-right text-sm text-text"
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

interface HubstaffSummaryCardProps {
  minHeight?: number;
}

export function HubstaffSummaryCard({ minHeight }: HubstaffSummaryCardProps = {}) {
  const { segments, isCheckedIn } = useHrmsData();
  const [tick, setTick] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [remote, setRemote] = useState<HubstaffSummary | null>(null);

  const fallback = useMemo(
    () => buildHubstaffSummary(segments, isCheckedIn, Date.now()),
    [segments, isCheckedIn, tick],
  );

  const pollMs = remote?.pollIntervalMs ?? DEFAULT_POLL_MS;

  const sync = useCallback(async () => {
    const fb = buildHubstaffSummary(segments, isCheckedIn, Date.now());
    setSyncing(true);
    try {
      const res = await fetchHubstaffSummary();
      setRemote(mergeHubstaffResponse(res, fb));
    } catch {
      setRemote({ ...fb, syncStatus: "offline", source: "error", message: "Could not reach HRMS API" });
    } finally {
      setSyncing(false);
    }
  }, [segments, isCheckedIn]);

  useEffect(() => {
    void sync();
  }, [sync]);

  useEffect(() => {
    const interval = setInterval(() => void sync(), pollMs);
    return () => clearInterval(interval);
  }, [pollMs, sync]);

  useEffect(() => {
    if (!isCheckedIn) return;
    const fast = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(fast);
  }, [isCheckedIn]);

  const s = remote ?? fallback;
  const isLive = s.source === "hubstaff";
  const badgeLabel = syncing
    ? "Syncing"
    : s.isTracking
      ? "Tracking"
      : s.syncStatus === "offline"
        ? "Offline"
        : "Synced";

  const openHubstaff = () => {
    Linking.openURL(HUBSTAFF_APP_URL).catch(() => {
      Alert.alert(
        "Hubstaff",
        "Open app.hubstaff.com in your browser to view full activity, screenshots, and reports.",
      );
    });
  };

  return (
    <Card
      elevated
      className="border-[#2EB67D]/20"
      style={minHeight ? { minHeight, flex: 1 } : undefined}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${HUBSTAFF_GREEN}20` }}
          >
            <Monitor size={iconSizes.md} color={HUBSTAFF_GREEN} />
          </View>
          <View>
            <Text style={{ fontFamily: font.bold }} className="text-base text-text">
              Hubstaff
            </Text>
            <Text style={{ fontFamily: font.regular }} className="text-xs text-textMuted">
              {isLive ? "Live API sync" : "Daily monitoring summary"}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => void sync()}
            hitSlop={8}
            className="h-8 w-8 items-center justify-center rounded-full active:bg-surfaceMuted"
          >
            <RefreshCw
              size={16}
              color={syncing ? palette.textSubtle : HUBSTAFF_GREEN}
            />
          </Pressable>
          <Badge
            label={badgeLabel}
            tone={
              syncing ? "info" : s.isTracking ? "success" : s.syncStatus === "offline" ? "neutral" : "info"
            }
          />
        </View>
      </View>

      <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-textSubtle">
        Synced {syncing ? "…" : s.lastSyncedLabel}
        {s.isTracking && s.liveFromHubstaff
          ? " · Hubstaff desktop timer active"
          : s.isTracking
            ? " · HRMS shift open"
            : ""}
        {isLive ? ` · refreshes every ${Math.round(pollMs / 1000)}s` : ""}
      </Text>

      {s.message && !isLive ? (
        <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-warning">
          {s.message}
        </Text>
      ) : null}

      <View className="mt-4 flex-row flex-wrap gap-2">
        <Metric label="Tracked today" value={s.trackedToday} icon={Timer} />
        <Metric label="Activity" value={`${s.activityPercent}%`} icon={Activity} />
        <Metric label="Idle time" value={`${s.idleMinutes}m`} icon={Keyboard} accent={palette.warning} />
      </View>

      <View className="mt-4 rounded-xl border border-border bg-surface px-3">
        <DetailRow label="Top project" value={s.topProject} />
        <DetailRow label="Top apps" value={s.topApp} />
        <DetailRow label="Input / hour" value={`${s.keyboardMousePerHour} events`} />
        <DetailRow label="Screenshots" value={String(s.screenshotsToday)} />
        <DetailRow label="This week" value={s.weekTracked} />
      </View>

      <View className="mt-3 flex-row items-center">
        <Camera size={14} color={palette.textSubtle} />
        <Text style={{ fontFamily: font.regular }} className="ml-1.5 flex-1 text-xs text-textSubtle">
          {isLive
            ? "Data from Hubstaff API. Keep the desktop app running on the same work email."
            : "Hubstaff tracks apps, URLs, and optional screenshots per your org policy."}
        </Text>
      </View>

      <Pressable
        onPress={openHubstaff}
        className="mt-4 flex-row items-center justify-center rounded-full border border-[#2EB67D]/40 bg-[#2EB67D]/10 py-3 active:opacity-90"
      >
        <Text style={{ fontFamily: font.semibold }} className="text-sm text-[#1F8F5C]">
          Open Hubstaff dashboard
        </Text>
        <ExternalLink size={16} color="#1F8F5C" style={{ marginLeft: 6 }} />
      </Pressable>
    </Card>
  );
}
