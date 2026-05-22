import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LogIn, LogOut, Timer } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useHrmsData } from "@/context/HrmsDataContext";
import type { AttendanceSegment } from "@/utils/attendance";
import { dailyTargetProgress } from "@/utils/hubstaff";

/** Keeps card height stable when punching in/out or adding sessions. */
const CARD_MIN_HEIGHT = 520;
const CLOCK_DISPLAY_MIN_HEIGHT = 132;
const SESSIONS_BLOCK_MIN_HEIGHT = 96;
const HINT_MIN_HEIGHT = 20;
const STAT_ROW_MIN_HEIGHT = 52;

const formatClock = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const formatTimeShort = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

function SessionChip({
  segment,
  index,
  open,
}: {
  segment: AttendanceSegment;
  index: number;
  open: boolean;
}) {
  return (
    <View
      className={`mr-2 mb-2 rounded-full border px-3 py-2 ${
        open ? "border-primary/30 bg-primary-soft" : "border-border bg-surfaceMuted"
      }`}
    >
      <Text style={{ fontFamily: font.semibold }} className="text-xs text-text">
        Session {index + 1}
      </Text>
      <Text style={{ fontFamily: font.medium }} className="mt-0.5 text-xs text-textMuted">
        {formatTimeShort(segment.in)}
        {" → "}
        {segment.out ? formatTimeShort(segment.out) : "Active"}
      </Text>
    </View>
  );
}

function PunchButton({
  label,
  icon: Icon,
  active,
  disabled,
  loading,
  variant,
  onPress,
}: {
  label: string;
  icon: typeof LogIn;
  active: boolean;
  disabled: boolean;
  loading: boolean;
  variant: "in" | "out";
  onPress: () => void;
}) {
  const isIn = variant === "in";
  const filled = isIn ? active && !disabled : active && !disabled;
  const bg = isIn
    ? filled
      ? "border-primary bg-primary"
      : "border-border bg-surfaceMuted"
    : filled
      ? "border-danger bg-danger"
      : "border-border bg-surface";
  const iconColor = filled
    ? palette.textInverse
    : palette.textMuted;
  const textColor = filled ? "text-textInverse" : "text-textMuted";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`relative min-h-[52px] flex-1 flex-row items-center justify-center rounded-full border-2 ${bg} ${
        disabled ? "opacity-50" : "active:opacity-90"
      }`}
    >
      <View
        className={`flex-row items-center ${loading ? "opacity-0" : ""}`}
        pointerEvents="none"
      >
        <Icon size={iconSizes.sm} color={iconColor} />
        <Text style={{ fontFamily: font.bold }} className={`ml-2 text-sm ${textColor}`}>
          {label}
        </Text>
      </View>
      {loading ? (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator color={iconColor} size="small" />
        </View>
      ) : null}
    </Pressable>
  );
}

export function ClockInOutCard() {
  const { segments, clockIn, clockOut, isCheckedIn, workedTodayLabel, lastEventHint } =
    useHrmsData();
  const [now, setNow] = useState(() => new Date());
  const [busyAction, setBusyAction] = useState<"in" | "out" | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const progress = dailyTargetProgress(segments, now.getTime());
  const firstIn = segments[0]?.in;

  const dateLabel = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  const handlePunch = async (action: "in" | "out") => {
    if (busyAction) return;
    if (action === "in" && isCheckedIn) return;
    if (action === "out" && !isCheckedIn) return;
    setBusyAction(action);
    try {
      if (action === "in") await clockIn();
      else await clockOut();
    } finally {
      setBusyAction(null);
    }
  };

  const openSegmentIndex = useMemo(
    () => segments.findIndex((s) => s.out === null),
    [segments],
  );

  const hintText =
    lastEventHint ?? (segments.length === 0 ? "No time logged yet today." : null);

  return (
    <Card
      elevated
      className={isCheckedIn ? "border-primary/25" : "border-border"}
      style={{ minHeight: CARD_MIN_HEIGHT }}
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
            {dateLabel}
          </Text>
          <Text style={{ fontFamily: font.semibold }} className="mt-0.5 text-base text-text">
            Time clock
          </Text>
        </View>
        <Badge
          label={isCheckedIn ? "On shift" : "Off shift"}
          tone={isCheckedIn ? "success" : "neutral"}
        />
      </View>

      <View className="mt-6 items-center">
        <View
          className="w-full items-center justify-center rounded-2xl border border-border bg-surfaceMuted px-6 py-6"
          style={{ minHeight: CLOCK_DISPLAY_MIN_HEIGHT }}
        >
          <View className="mb-3 h-2 w-2">
            {isCheckedIn ? (
              <View className="h-2 w-2 rounded-full bg-success" />
            ) : null}
          </View>
          <Text
            style={{ fontFamily: font.bold, letterSpacing: 2 }}
            className="text-[40px] leading-[48px] text-text"
          >
            {formatClock(now.getTime())}
          </Text>
          <Text
            style={{ fontFamily: font.regular }}
            className="mt-2 text-center text-sm text-textSubtle"
            numberOfLines={1}
          >
            {isCheckedIn ? "Timer running — you are clocked in" : "Ready to start your day"}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Timer size={iconSizes.xs} color={palette.textMuted} />
            <Text style={{ fontFamily: font.medium }} className="ml-1.5 text-xs text-textMuted">
              Daily target (8h)
            </Text>
          </View>
          <Text style={{ fontFamily: font.semibold }} className="text-xs text-primary">
            {progress}%
          </Text>
        </View>
        <View className="h-2.5 overflow-hidden rounded-full bg-surfaceMuted">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </View>
        <View
          className="mt-3 flex-row gap-4"
          style={{ minHeight: STAT_ROW_MIN_HEIGHT }}
        >
          <View className="flex-1 justify-center">
            <Text style={{ fontFamily: font.regular }} className="text-xs text-textSubtle">
              Worked today
            </Text>
            <Text style={{ fontFamily: font.bold }} className="text-lg text-text">
              {workedTodayLabel}
            </Text>
          </View>
          <View className="flex-1 justify-center">
            <Text style={{ fontFamily: font.regular }} className="text-xs text-textSubtle">
              First clock-in
            </Text>
            <Text style={{ fontFamily: font.bold }} className="text-lg text-text">
              {firstIn ? formatTimeShort(firstIn) : "—"}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-6 flex-row gap-3">
        <PunchButton
          label="Clock in"
          icon={LogIn}
          variant="in"
          active={!isCheckedIn}
          disabled={isCheckedIn}
          loading={busyAction === "in"}
          onPress={() => void handlePunch("in")}
        />
        <PunchButton
          label="Clock out"
          icon={LogOut}
          variant="out"
          active={isCheckedIn}
          disabled={!isCheckedIn}
          loading={busyAction === "out"}
          onPress={() => void handlePunch("out")}
        />
      </View>

      <View style={{ minHeight: HINT_MIN_HEIGHT }} className="mt-4 justify-center">
        {hintText ? (
          <Text
            style={{ fontFamily: font.regular }}
            className="text-center text-xs text-textMuted"
            numberOfLines={2}
          >
            {hintText}
          </Text>
        ) : null}
      </View>

      <View
        className="mt-5 border-t border-border pt-4"
        style={{ minHeight: SESSIONS_BLOCK_MIN_HEIGHT }}
      >
        <Text style={{ fontFamily: font.semibold }} className="mb-3 text-sm text-text">
          Sessions today
        </Text>
        {segments.length === 0 ? (
          <Text style={{ fontFamily: font.regular }} className="text-sm text-textSubtle">
            No sessions yet — clock in to start.
          </Text>
        ) : (
          <View className="flex-row flex-wrap">
            {segments.map((s, i) => (
              <SessionChip
                key={`${s.in}-${i}`}
                segment={s}
                index={i}
                open={i === openSegmentIndex}
              />
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}
