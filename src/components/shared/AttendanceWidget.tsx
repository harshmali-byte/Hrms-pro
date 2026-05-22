import { useWindowDimensions, View } from "react-native";
import { breakpoints } from "@/constants/breakpoints";
import { ClockInOutCard } from "./ClockInOutCard";
import { HubstaffSummaryCard } from "./HubstaffSummaryCard";

const ROW_MIN_HEIGHT = 520;

/** Clock punch + Hubstaff monitoring — used on dashboard and attendance. */
export function AttendanceWidget() {
  const { width } = useWindowDimensions();
  const sideBySide = width >= breakpoints.md;

  if (sideBySide) {
    return (
      <View className="flex-row items-stretch gap-4" style={{ minHeight: ROW_MIN_HEIGHT }}>
        <View className="min-w-0 flex-[1.1]">
          <ClockInOutCard />
        </View>
        <View className="min-w-0 flex-1">
          <HubstaffSummaryCard minHeight={ROW_MIN_HEIGHT} />
        </View>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <ClockInOutCard />
      <HubstaffSummaryCard />
    </View>
  );
}
