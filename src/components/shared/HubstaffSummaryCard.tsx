import { useEffect, useMemo, useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import {
  Activity,
  Camera,
  ExternalLink,
  Keyboard,
  Monitor,
  Timer,
} from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useHrmsData } from "@/context/HrmsDataContext";
import { buildHubstaffSummary, HUBSTAFF_APP_URL } from "@/utils/hubstaff";

const HUBSTAFF_GREEN = "#2EB67D";

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

  useEffect(() => {
    if (!isCheckedIn) return;
    const t = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, [isCheckedIn]);

  const s = useMemo(
    () => buildHubstaffSummary(segments, isCheckedIn, Date.now()),
    [segments, isCheckedIn, tick],
  );

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
              Daily monitoring summary
            </Text>
          </View>
        </View>
        <Badge
          label={s.isTracking ? "Tracking" : s.syncStatus === "offline" ? "Offline" : "Synced"}
          tone={s.isTracking ? "success" : s.syncStatus === "offline" ? "neutral" : "info"}
        />
      </View>

      <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-textSubtle">
        Synced {s.lastSyncedLabel}
        {s.isTracking ? " · Live activity from your workstation" : ""}
      </Text>

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
          Hubstaff tracks apps, URLs, and optional screenshots per your org policy.
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
