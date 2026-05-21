import { Pressable, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View className="items-center justify-center px-6 py-14">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-surfaceMuted">
        <Icon size={iconSizes.lg} color={palette.textMuted} />
      </View>
      <Text
        style={{ fontFamily: font.semibold }}
        className="mt-5 text-center text-lg tracking-tight text-text"
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={{ fontFamily: font.regular }}
          className="mt-2 max-w-[280px] text-center text-base leading-6 text-textMuted"
        >
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="mt-5 rounded-full border border-primary bg-primary-soft px-5 py-2.5 active:opacity-90"
        >
          <Text style={{ fontFamily: font.semibold }} className="text-sm text-primary">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
