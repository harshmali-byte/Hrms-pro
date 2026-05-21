import { Text, View } from "react-native";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";

interface Props {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { box: "h-9 w-9", text: "text-sm" },
  md: { box: "h-11 w-11", text: "text-base" },
  lg: { box: "h-14 w-14", text: "text-lg" },
  xl: { box: "h-20 w-20", text: "text-2xl" },
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

export function Avatar({ name, color = palette.primary, size = "md" }: Props) {
  const { box, text } = sizeMap[size];
  return (
    <View
      className={`${box} items-center justify-center rounded-full`}
      style={{ backgroundColor: color }}
    >
      <Text style={{ fontFamily: font.bold }} className={`${text} text-textInverse`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
