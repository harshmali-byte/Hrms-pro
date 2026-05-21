import { useMemo } from "react";
import { Alert, Text, View } from "react-native";
import { CalendarClock, Clock3, TrendingUp } from "lucide-react-native";
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
import type { AttendanceRecord } from "@/types";

export function AttendanceScreen({ embedded = false }: { embedded?: boolean }) {
  const { segments, attendanceHistory } = useHrmsData();
  const todayLabel = shortDayLabel();

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
    return {
      present: present.length,
      avg: avg.toFixed(1),
      onTimeRate: "92%",
    };
  }, [mergedHistory]);

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Attendance" subtitle="Your clock-in history" embedded={embedded} />

      <HelpBanner text="Check in when you start work and check out when you leave. Today’s row updates in real time." />

      <AttendanceWidget />

      <SectionHeader title="This month" />
      <View className="flex-row gap-3">
        <StatCard
          label="Days present"
          value={monthStats.present}
          icon={CalendarClock}
          accent={palette.primary}
          onPress={() =>
            Alert.alert(
              "Days present",
              `You were present on ${monthStats.present} working days in the current view (demo, merged with today's punch).`,
            )
          }
        />
        <StatCard
          label="Avg hours / day"
          value={monthStats.avg}
          icon={Clock3}
          accent={palette.accent}
          onPress={() =>
            Alert.alert(
              "Average hours",
              `Average hours per present day: ${monthStats.avg} hrs (demo calculation from recent history).`,
            )
          }
        />
      </View>
      <View className="mt-3 flex-row gap-3">
        <StatCard
          label="On-time rate"
          value={monthStats.onTimeRate}
          icon={TrendingUp}
          accent="#10B981"
          trend="+4% MoM"
          onPress={() =>
            Alert.alert(
              "On-time rate",
              `Demo metric: ${monthStats.onTimeRate} on-time (mock). In production this would compare punch-in to shift start.`,
            )
          }
        />
        <View className="flex-1" />
      </View>

      <SectionHeader title="Recent days" />
      <View className="gap-2">
        {mergedHistory.map((r) => (
          <AttendanceRow key={r.date} record={r} />
        ))}
      </View>
    </ScreenContainer>
  );
}
