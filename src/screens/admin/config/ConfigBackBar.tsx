import { Pressable, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";

export function ConfigBackBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <View className="mb-4 flex-row items-center">
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        className="mr-3 h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface active:bg-surfaceMuted"
      >
        <ArrowLeft size={iconSizes.sm} color={palette.text} />
      </Pressable>
      <Text style={{ fontFamily: font.semibold }} className="text-lg text-text">
        {title}
      </Text>
    </View>
  );
}
