import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Bell, Globe, Menu, Search } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes, layout } from "@/constants/theme";
import { Avatar } from "@/components/ui/Avatar";
import { useHrmsData } from "@/context/HrmsDataContext";
import { useResponsive } from "@/hooks/useResponsive";
import { NotificationsSheet } from "./NotificationsSheet";

interface Props {
  title: string;
  userName: string;
  avatarColor: string;
  onMenuPress?: () => void;
}

export function TopBar({ title, userName, avatarColor, onMenuPress }: Props) {
  const { unreadNotificationCount, globalSearch, setGlobalSearch } = useHrmsData();
  const [notifOpen, setNotifOpen] = useState(false);
  const { isMobile, isDesktop } = useResponsive();

  return (
    <>
      <View
        style={{ minHeight: layout.topBarHeight }}
        className="z-10 border-b border-border bg-surface shadow-sm"
      >
        <View
          className={`px-4 ${isDesktop ? "px-7" : ""} ${isMobile ? "py-3" : "flex-row items-center py-3"}`}
        >
          <View className={`flex-row items-center ${isMobile ? "mb-3 w-full" : "mr-6 min-w-[200px]"}`}>
            {onMenuPress ? (
              <Pressable
                onPress={onMenuPress}
                className="mr-3 h-10 w-10 items-center justify-center rounded-lg border border-border active:bg-surfaceMuted"
                accessibilityLabel="Open menu"
              >
                <Menu size={iconSizes.md} color={palette.text} />
              </Pressable>
            ) : null}
            <View>
              <Text style={{ fontFamily: font.bold }} className="text-xl text-text">
                {title}
              </Text>
              {isDesktop ? (
                <Text style={{ fontFamily: font.regular }} className="text-xs text-textSubtle">
                  Organiq HRMS
                </Text>
              ) : null}
            </View>
          </View>

          <View className={`flex-1 flex-row items-center ${isMobile ? "flex-wrap gap-2" : ""}`}>
            <View
              className={`min-h-[42px] flex-row items-center rounded-xl border border-border bg-background px-3 ${
                isMobile ? "w-full" : "mx-auto max-w-xl flex-1"
              }`}
            >
              <Search size={iconSizes.sm} color={palette.textSubtle} />
              <TextInput
                placeholder="Search people, leave, policies…"
                placeholderTextColor={palette.textSubtle}
                value={globalSearch}
                onChangeText={setGlobalSearch}
                style={{
                  fontFamily: font.regular,
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 14,
                  color: palette.text,
                  paddingVertical: 8,
                  outlineStyle: "none",
                } as object}
              />
            </View>

            <View className={`flex-row items-center ${isMobile ? "w-full justify-end" : "ml-4"}`}>
              <Pressable
                onPress={() => setNotifOpen(true)}
                accessibilityLabel="Notifications"
                className="relative mr-2 h-10 w-10 items-center justify-center rounded-xl border border-border active:bg-surfaceMuted"
              >
                <Bell size={iconSizes.md} color={palette.textMuted} />
                {unreadNotificationCount > 0 ? (
                  <View className="absolute -right-0.5 -top-0.5 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1">
                    <Text
                      style={{ fontFamily: font.bold, fontSize: 10 }}
                      className="text-textInverse"
                    >
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </Text>
                  </View>
                ) : null}
              </Pressable>

              {!isMobile ? (
                <Pressable className="mr-2 flex-row items-center rounded-xl border border-border px-3 py-2 active:bg-surfaceMuted">
                  <Globe size={iconSizes.sm} color={palette.textMuted} />
                  <Text style={{ fontFamily: font.medium }} className="ml-2 text-sm text-textMuted">
                    EN
                  </Text>
                </Pressable>
              ) : null}

              <Avatar name={userName} color={avatarColor} size="sm" />
            </View>
          </View>
        </View>
      </View>

      <NotificationsSheet visible={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
