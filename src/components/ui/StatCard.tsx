import { Pressable, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { iconSizes } from "@/constants/theme";
import { Card } from "./Card";
import { Meta, StatValue } from "./Typography";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
  trend?: string;
  /** Opens a drill-down or info action when the KPI is tapped. */
  onPress?: () => void;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "#4338CA",
  trend,
  onPress,
}: Props) {
  const card = (
    <Card className="flex-1" elevated>
      <View className="flex-row items-center justify-between">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Icon size={iconSizes.sm} color={accent} />
        </View>
        {trend ? (
          <Text style={{ fontFamily: font.medium }} className="text-xs text-textSubtle">
            {trend}
          </Text>
        ) : null}
      </View>
      <StatValue className="mt-3">{value}</StatValue>
      <Meta className="mt-1">{label}</Meta>
    </Card>
  );

  if (!onPress) return card;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      className="flex-1 active:opacity-90"
    >
      {card}
    </Pressable>
  );
}
