import { Pressable, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { palette, iconSizes } from "@/constants/theme";
import { LinkLabel, SectionTitle } from "@/components/ui/Typography";

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View className="mb-1 mt-7 flex-row items-center justify-between">
      <SectionTitle>{title}</SectionTitle>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          className="flex-row items-center active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <LinkLabel>{actionLabel}</LinkLabel>
          <ChevronRight size={iconSizes.sm} color={palette.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}
