import { Pressable, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Card } from "./Card";

interface Props {
  label: string;
  value: string | number;
  trend: string;
  positive?: boolean;
  icon: LucideIcon;
  onPress?: () => void;
}

export function DashboardKpiCard({
  label,
  value,
  trend,
  positive = true,
  icon: Icon,
  onPress,
}: Props) {
  const inner = (
    <Card className="min-w-[140px] flex-1" elevated>
      <View className="flex-row items-start justify-between">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: palette.primarySoft }}
        >
          <Icon size={iconSizes.md} color={palette.primary} />
        </View>
      </View>
      <Text
        style={{ fontFamily: font.bold }}
        className="mt-4 text-3xl tracking-tight text-text"
      >
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </Text>
      <Text style={{ fontFamily: font.medium }} className="mt-1 text-sm text-textMuted">
        {label}
      </Text>
      <Text
        style={{ fontFamily: font.medium }}
        className={`mt-2 text-xs ${positive ? "text-success" : "text-danger"}`}
      >
        {trend}
      </Text>
    </Card>
  );

  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} className="flex-1 active:opacity-90">
      {inner}
    </Pressable>
  );
}
