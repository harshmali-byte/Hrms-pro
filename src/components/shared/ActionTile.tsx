import { Pressable, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";

interface Props {
  label: string;
  icon: LucideIcon;
  accent?: string;
  onPress?: () => void;
}

export function ActionTile({ label, icon: Icon, accent = palette.primary, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityState={{ disabled: !onPress }}
      className={`w-[31%] items-center rounded-xl border border-border bg-surface p-3.5 ${
        onPress ? "active:bg-surfaceMuted" : "opacity-50"
      }`}
    >
      <View
        className="mb-2 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon size={iconSizes.md} color={accent} />
      </View>
      <Text style={{ fontFamily: font.medium }} numberOfLines={1} className="text-xs text-text">
        {label}
      </Text>
    </Pressable>
  );
}
