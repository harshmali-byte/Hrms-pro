import { useState } from "react";
import { Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Bell, ChevronDown, Search } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes, layout } from "@/constants/theme";
import { Avatar } from "@/components/ui/Avatar";
import { useHrmsData } from "@/context/HrmsDataContext";
import { NotificationsSheet } from "./NotificationsSheet";

interface Props {
  userName: string;
  userRole: string;
  avatarColor: string;
}

export function TopBar({ userName, userRole, avatarColor }: Props) {
  const { unreadNotificationCount, globalSearch, setGlobalSearch } = useHrmsData();
  const [notifOpen, setNotifOpen] = useState(false);
  const { width } = useWindowDimensions();
  const compact = width < 720;

  return (
    <>
      <View
        style={{ minHeight: layout.topBarHeight }}
        className="flex-row items-center border-b border-border bg-surface px-5 py-3"
      >
        <View
          className={`min-h-[44px] flex-1 flex-row items-center rounded-full border border-border bg-surfaceMuted px-4 ${
            compact ? "" : "max-w-2xl"
          }`}
        >
          <Search size={iconSizes.sm} color={palette.textSubtle} />
          <TextInput
            placeholder="Search employees, leave, payroll…"
            placeholderTextColor={palette.textSubtle}
            value={globalSearch}
            onChangeText={setGlobalSearch}
            style={{
              fontFamily: font.regular,
              flex: 1,
              marginLeft: 10,
              fontSize: 14,
              color: palette.text,
              paddingVertical: 10,
            }}
          />
        </View>

        <View className="ml-3 flex-row items-center">
          <Pressable
            onPress={() => setNotifOpen(true)}
            accessibilityLabel="Notifications"
            className="relative mr-2 h-10 w-10 items-center justify-center rounded-full active:bg-surfaceMuted"
          >
            <Bell size={iconSizes.md} color={palette.textMuted} />
            {unreadNotificationCount > 0 ? (
              <View className="absolute right-1 top-1 min-w-[18px] items-center justify-center rounded-full bg-danger px-1">
                <Text style={{ fontFamily: font.bold }} className="text-[10px] text-textInverse">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable className="flex-row items-center rounded-full border border-border bg-surface px-2 py-1.5 active:bg-surfaceMuted">
            <Avatar name={userName} color={avatarColor} size="sm" />
            {!compact ? (
              <View className="ml-2 mr-1 max-w-[140px]">
                <Text
                  style={{ fontFamily: font.semibold }}
                  className="text-sm text-text"
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={{ fontFamily: font.regular }}
                  className="text-xs text-textMuted"
                  numberOfLines={1}
                >
                  {userRole}
                </Text>
              </View>
            ) : null}
            <ChevronDown size={14} color={palette.textSubtle} style={{ marginLeft: 4 }} />
          </Pressable>
        </View>
      </View>

      <NotificationsSheet visible={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
