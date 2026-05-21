import { useState } from "react";
import { Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Bell, Globe, Search } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes, layout } from "@/constants/theme";
import { Avatar } from "@/components/ui/Avatar";
import { useHrmsData } from "@/context/HrmsDataContext";
import { NotificationsSheet } from "./NotificationsSheet";

interface Props {
  title: string;
  userName: string;
  avatarColor: string;
}

export function TopBar({ title, userName, avatarColor }: Props) {
  const { unreadNotificationCount, globalSearch, setGlobalSearch } = useHrmsData();
  const [notifOpen, setNotifOpen] = useState(false);
  const { width } = useWindowDimensions();
  const stacked = width < 720;

  return (
    <>
      <View
        style={{ minHeight: layout.topBarHeight }}
        className={`border-b border-border bg-surface px-4 py-3 ${stacked ? "" : "flex-row items-center"}`}
      >
        <Text
          style={{ fontFamily: font.bold }}
          className={`text-xl text-text ${stacked ? "mb-3" : "mr-4"}`}
        >
          {title}
        </Text>

        <View className={`flex-1 flex-row items-center ${stacked ? "flex-wrap gap-2" : ""}`}>
          <View
            className={`min-h-[40px] flex-row items-center rounded-lg border border-border bg-surfaceMuted px-3 py-2 ${
              stacked ? "w-full" : "mx-3 max-w-[360px] flex-1"
            }`}
          >
            <Search size={iconSizes.sm} color={palette.textSubtle} />
            <TextInput
              placeholder="Search anything..."
              placeholderTextColor={palette.textSubtle}
              value={globalSearch}
              onChangeText={setGlobalSearch}
              style={{
                fontFamily: font.regular,
                flex: 1,
                marginLeft: 8,
                fontSize: 14,
                color: palette.text,
                paddingVertical: 4,
              }}
            />
          </View>

          <View className="flex-row items-center">
            <Pressable
              onPress={() => setNotifOpen(true)}
              accessibilityLabel="Notifications"
              className="relative mr-2 h-10 w-10 items-center justify-center rounded-lg active:bg-surfaceMuted"
            >
              <Bell size={iconSizes.md} color={palette.textMuted} />
              {unreadNotificationCount > 0 ? (
                <View className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-danger" />
              ) : null}
            </Pressable>

            <Pressable className="mr-2 flex-row items-center rounded-lg border border-border px-2.5 py-2 active:bg-surfaceMuted">
              <Globe size={iconSizes.sm} color={palette.textMuted} />
              <Text style={{ fontFamily: font.medium }} className="ml-1.5 text-sm text-textMuted">
                English
              </Text>
            </Pressable>

            <Avatar name={userName} color={avatarColor} size="sm" />
          </View>
        </View>
      </View>

      <NotificationsSheet visible={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
