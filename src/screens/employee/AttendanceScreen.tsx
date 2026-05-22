import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CalendarClock, Clock3, TrendingUp } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import { buildTodayAttendanceRecord, useHrmsData } from "@/context/HrmsDataContext";
import { shortDayLabel } from "@/utils/dates";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { AttendanceWidget } from "@/components/shared/AttendanceWidget";
import { AttendanceRow } from "@/components/shared/AttendanceRow";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Card } from "@/components/ui/Card";
import type { AttendanceRecord } from "@/types";

type StatSheet = "present" | "avg" | "ontime" | null;

function parseCheckInMinutes(checkIn?: string): number | null {
  if (!checkIn || checkIn === "—") return null;
  const [h, m] = checkIn.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

export function AttendanceScreen({ embedded = false }: { embedded?: boolean }) {
  const { segments, attendanceHistory, reload } = useHrmsData();
  const todayLabel = shortDayLabel();
  const [statSheet, setStatSheet] = useState<StatSheet>(null);
  const [refreshing, setRefreshing] = useState(false);

  const mergedHistory = useMemo(() => {
    const todayRow = buildTodayAttendanceRecord(segments, todayLabel);
    const withoutToday = attendanceHistory.filter((r) => r.date !== todayLabel);
    const head: AttendanceRecord[] = todayRow ? [todayRow, ...withoutToday] : [...attendanceHistory];
    return head;
  }, [segments, todayLabel, attendanceHistory]);

  const monthStats = useMemo(() => {
    const present = mergedHistory.filter((r) => r.status === "present");
    const totalHours = present.reduce((sum, r) => sum + (r.hours ?? 0), 0);
    const avg = present.length === 0 ? 0 : totalHours / present.length;

    const shiftStart = 9 * 60 + 30;
    let onTime = 0;
    for (const r of present) {
      const mins = parseCheckInMinutes(r.checkIn);
      if (mins != null && mins <= shiftStart + 15) onTime += 1;
    }
    const onTimeRate =
      present.length === 0 ? 0 : Math.round((onTime / present.length) * 100);

    return {
      present: present.length,
      avg: avg.toFixed(1),
      onTimeRate: `${onTimeRate}%`,
      onTimeCount: onTime,
      totalPresent: present.length,
      totalHours: totalHours.toFixed(1),
    };
  }, [mergedHistory]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  return (
    <ScreenContainer embedded={embedded}>
      <Header
        title="Attendance"
        subtitle="Your clock-in history"
        embedded={embedded}
        right={
          <Pressable
            onPress={() => void refresh()}
            className="rounded-full border border-border px-3 py-2 active:bg-surfaceMuted"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : (
              <Text style={{ fontFamily: font.semibold }} className="text-xs text-primary">
                Refresh
              </Text>
            )}
          </Pressable>
        }
      />

      <HelpBanner text="Clock in/out here for HRMS attendance. Hubstaff tracks apps and activity in parallel — both summaries update through your work day." />

      <AttendanceWidget />

      <SectionHeader title="This month" />
      <View className="flex-row gap-3">
        <StatCard
          label="Days present"
          value={monthStats.present}
          icon={CalendarClock}
          accent={palette.primary}
          onPress={() => setStatSheet("present")}
        />
        <StatCard
          label="Avg hours / day"
          value={monthStats.avg}
          icon={Clock3}
          accent={palette.accent}
          onPress={() => setStatSheet("avg")}
        />
      </View>
      <View className="mt-3 flex-row gap-3">
        <StatCard
          label="On-time rate"
          value={monthStats.onTimeRate}
          icon={TrendingUp}
          accent="#10B981"
          trend={`${monthStats.onTimeCount}/${monthStats.totalPresent} punches`}
          onPress={() => setStatSheet("ontime")}
        />
        <View className="flex-1" />
      </View>

      <SectionHeader title="Recent days" />
      <View className="gap-2">
        {mergedHistory.length === 0 ? (
          <Card>
            <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
              No attendance history yet. Clock in to start tracking.
            </Text>
          </Card>
        ) : (
          mergedHistory.map((r) => <AttendanceRow key={`${r.date}-${r.dateKey ?? ""}`} record={r} />)
        )}
      </View>

      <BottomSheet
        visible={statSheet === "present"}
        title="Days present"
        onClose={() => setStatSheet(null)}
      >
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
          You were present on {monthStats.present} days in the last {mergedHistory.length} records
          loaded from the server (includes today if clocked in).
        </Text>
      </BottomSheet>

      <BottomSheet
        visible={statSheet === "avg"}
        title="Average hours"
        onClose={() => setStatSheet(null)}
      >
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
          Average {monthStats.avg} hours per present day. Total {monthStats.totalHours} hours across
          present days in this window.
        </Text>
      </BottomSheet>

      <BottomSheet
        visible={statSheet === "ontime"}
        title="On-time arrivals"
        onClose={() => setStatSheet(null)}
      >
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
          {monthStats.onTimeRate} of punches were within 15 minutes of the 09:30 shift start (
          {monthStats.onTimeCount} of {monthStats.totalPresent} present days).
        </Text>
      </BottomSheet>
    </ScreenContainer>
  );
}
