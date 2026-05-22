import { Text, View } from "react-native";
import { Info } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";

interface Props {
  text: string;
}

export function HelpBanner({ text }: Props) {
  return (
    <View className="mb-5 flex-row items-start rounded-xl border border-primary/15 bg-primary-soft px-4 py-3.5">
      <Info size={iconSizes.sm} color={palette.primary} style={{ marginTop: 2 }} />
      <Text style={{ fontFamily: font.regular }} className="ml-2.5 flex-1 text-sm leading-5 text-text">
        {text}
      </Text>
    </View>
  );
}
