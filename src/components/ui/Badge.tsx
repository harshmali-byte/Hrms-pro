import { Text, View } from "react-native";
import { font } from "@/constants/fonts";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

interface Props {
  label: string;
  tone?: BadgeTone;
}

const toneMap: Record<BadgeTone, { bg: string; text: string }> = {
  neutral: { bg: "bg-surfaceMuted", text: "text-text" },
  primary: { bg: "bg-primary-soft", text: "text-primary" },
  success: { bg: "bg-success-soft", text: "text-success" },
  warning: { bg: "bg-warning-soft", text: "text-warning" },
  danger: { bg: "bg-danger-soft", text: "text-danger" },
  info: { bg: "bg-info-soft", text: "text-info" },
};

export function Badge({ label, tone = "neutral" }: Props) {
  const { bg, text } = toneMap[tone];
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bg}`}>
      <Text style={{ fontFamily: font.semibold }} className={`text-xs ${text}`}>
        {label}
      </Text>
    </View>
  );
}
