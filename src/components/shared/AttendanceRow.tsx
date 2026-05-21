import { Alert, Pressable, Text, View } from "react-native";
import { font } from "@/constants/fonts";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const statusToTone: Record<AttendanceStatus, BadgeTone> = {
  present: "success",
  absent: "danger",
  leave: "warning",
  weekend: "neutral",
  holiday: "info",
};

const statusToLabel: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  leave: "On leave",
  weekend: "Weekend",
  holiday: "Holiday",
};

interface Props {
  record: AttendanceRecord;
}

export function AttendanceRow({ record }: Props) {
  const isWorkingDay = record.status === "present";

  const showDetail = () => {
    const status = statusToLabel[record.status];
    if (record.status === "present") {
      Alert.alert(
        `${record.date} · ${status}`,
        [
          `Check-in: ${record.checkIn ?? "—"}`,
          `Check-out: ${record.checkOut ?? "—"}`,
          `Hours: ${record.hours != null ? `${record.hours.toFixed(1)} hrs` : "—"}`,
        ].join("\n"),
      );
    } else {
      Alert.alert(`${record.date}`, `Status: ${status}\nNo punch data for this day.`);
    }
  };

  return (
    <Pressable
      onPress={showDetail}
      accessibilityRole="button"
      accessibilityLabel={`Attendance for ${record.date}`}
      className="flex-row items-center rounded-xl border border-border bg-surface p-3.5 active:bg-surfaceMuted"
    >
      <View className="w-14">
        <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
          {record.date}
        </Text>
      </View>

      <View className="ml-2 flex-1">
        {isWorkingDay ? (
          <>
            <Text style={{ fontFamily: font.regular }} className="text-sm text-text">
              {record.checkIn} → {record.checkOut ?? "—"}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-xs text-textMuted">
              {record.hours != null ? `${record.hours.toFixed(1)} hrs worked` : ""}
            </Text>
          </>
        ) : (
          <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
            No clock-in
          </Text>
        )}
      </View>

      <Badge label={statusToLabel[record.status]} tone={statusToTone[record.status]} />
    </Pressable>
  );
}
