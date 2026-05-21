import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Clock, LogIn, LogOut } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useHrmsData } from "@/context/HrmsDataContext";
import type { AttendanceSegment } from "@/utils/attendance";

const formatClock = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

function sessionSummary(segments: AttendanceSegment[]): string {
  if (segments.length === 0) {
    return "No punch events yet today. Use Check in to start a session.";
  }
  return segments
    .map((s, i) => {
      const outLabel = s.out === null ? "Open (still in)" : formatClock(s.out);
      return `Session ${i + 1}: ${formatClock(s.in)} → ${outLabel}`;
    })
    .join("\n");
}

export function AttendanceWidget() {
  const {
    segments,
    clockIn,
    clockOut,
    isCheckedIn,
    workedTodayLabel,
    lastEventHint,
  } = useHrmsData();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const live = now;

  const showSessions = () => {
    Alert.alert("Today’s attendance", `${sessionSummary(segments)}\n\nTotal: ${workedTodayLabel}`);
  };

  return (
    <Card>
      <Pressable
        onPress={showSessions}
        accessibilityRole="button"
        accessibilityLabel="View today’s punch sessions"
        className="active:opacity-90"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
              {live.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
              })}
            </Text>
            <Text
              style={{ fontFamily: font.bold }}
              className="mt-1 text-3xl tracking-tight text-text"
            >
              {formatTime(live)}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-1 text-xs text-textSubtle">
              Tap for session detail
            </Text>
          </View>
          <View className="items-end">
            <View className="flex-row items-center">
              <Clock size={iconSizes.xs} color={palette.textMuted} />
              <Text style={{ fontFamily: font.medium }} className="ml-1.5 text-xs text-textMuted">
                Work time today
              </Text>
            </View>
            <Text
              style={{ fontFamily: font.bold }}
              className="mt-1 text-lg tracking-tight text-text"
            >
              {workedTodayLabel}
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="mt-5">
        <Button
          label={isCheckedIn ? "Check out" : "Check in"}
          icon={isCheckedIn ? LogOut : LogIn}
          variant={isCheckedIn ? "danger" : "primary"}
          fullWidth
          onPress={isCheckedIn ? clockOut : clockIn}
        />
      </View>

      {lastEventHint ? (
        <Pressable onPress={showSessions} accessibilityRole="button">
          <Text
            style={{ fontFamily: font.regular }}
            className="mt-3 text-center text-xs text-textMuted"
          >
            {lastEventHint}
          </Text>
        </Pressable>
      ) : (
        <Text style={{ fontFamily: font.regular }} className="mt-3 text-center text-xs text-textSubtle">
          No time logged yet today.
        </Text>
      )}
    </Card>
  );
}
