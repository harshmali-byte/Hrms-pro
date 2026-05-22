import { Text, View } from "react-native";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import { Avatar } from "./Avatar";

export type PresenceStatus = "online" | "offline";

interface Props {
  name: string;
  color?: string;
  size?: "sm" | "md";
  status: PresenceStatus;
  showLabel?: boolean;
}

const dotSize = { sm: "h-2.5 w-2.5 border-2", md: "h-3 w-3 border-2" };

export function AvatarWithStatus({
  name,
  color,
  size = "sm",
  status,
  showLabel = false,
}: Props) {
  const online = status === "online";

  return (
    <View className="flex-row items-center">
      <View className="relative">
        <Avatar name={name} color={color} size={size} />
        <View
          className={`absolute bottom-0 right-0 rounded-full border-surface ${dotSize[size]}`}
          style={{ backgroundColor: online ? palette.success : palette.textSubtle }}
        />
      </View>
      {showLabel ? (
        <Text
          style={{ fontFamily: font.medium }}
          className={`ml-2 text-xs ${online ? "text-success" : "text-textSubtle"}`}
        >
          {online ? "Online" : "Offline"}
        </Text>
      ) : null}
    </View>
  );
}
