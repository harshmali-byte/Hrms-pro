import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Bell, ChevronDown, Search } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes, layout } from "@/constants/theme";
import { AvatarWithStatus, type PresenceStatus } from "@/components/ui/AvatarWithStatus";
import { useAuth } from "@/context/AuthContext";
import { useHrmsData } from "@/context/HrmsDataContext";
import { NotificationsSheet } from "./NotificationsSheet";

const ACTION_SIZE = 40;

interface Props {
  userName: string;
  userRole: string;
  avatarColor: string;
}

export function TopBar({ userName, userRole, avatarColor }: Props) {
  const { unreadNotificationCount, globalSearch, setGlobalSearch, isCheckedIn, isReady } =
    useHrmsData();
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const { width } = useWindowDimensions();
  const compact = width < 900;

  const presence: PresenceStatus = useMemo(() => {
    if (!isReady) return "offline";
    if (user?.role === "employee") return isCheckedIn ? "online" : "offline";
    return "online";
  }, [isReady, user?.role, isCheckedIn]);

  return (
    <>
      <View
        style={{ minHeight: layout.topBarHeight }}
        className="flex-row items-center gap-3 border-b border-border bg-surface px-4 py-2.5 md:px-5"
      >
        <View
          className="min-h-[44px] flex-1 flex-row items-center rounded-full border border-border bg-surfaceMuted px-4"
          style={{ maxHeight: 44 }}
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
              paddingVertical: 0,
              height: 44,
            }}
          />
        </View>

        <View className="shrink-0 flex-row items-center gap-2">
          <Pressable
            onPress={() => setNotifOpen(true)}
            accessibilityLabel="Notifications"
            style={{ width: ACTION_SIZE, height: ACTION_SIZE }}
            className="items-center justify-center rounded-full active:bg-surfaceMuted"
          >
            <Bell size={iconSizes.md} color={palette.textMuted} />
            {unreadNotificationCount > 0 ? (
              <View className="absolute right-0.5 top-0.5 min-w-[18px] items-center justify-center rounded-full bg-danger px-1">
                <Text style={{ fontFamily: font.bold }} className="text-[10px] text-textInverse">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            style={{ height: ACTION_SIZE }}
            className="max-w-[200px] flex-row items-center rounded-full border border-border bg-surface pl-1 pr-2 active:bg-surfaceMuted md:max-w-[220px]"
          >
            <AvatarWithStatus
              name={userName}
              color={avatarColor}
              size="sm"
              status={presence}
            />
            {!compact ? (
              <View className="ml-2 min-w-0 flex-1 justify-center">
                <Text
                  style={{ fontFamily: font.semibold }}
                  className="text-sm leading-4 text-text"
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Text
                  style={{ fontFamily: font.regular }}
                  className="text-[11px] leading-4 text-textMuted"
                  numberOfLines={1}
                >
                  {presence === "online" ? "Online" : "Offline"} · {userRole}
                </Text>
              </View>
            ) : (
              <Text
                style={{ fontFamily: font.medium }}
                className={`ml-1.5 text-[10px] ${presence === "online" ? "text-success" : "text-textSubtle"}`}
              >
                {presence === "online" ? "On" : "Off"}
              </Text>
            )}
            <ChevronDown size={14} color={palette.textSubtle} style={{ marginLeft: 4 }} />
          </Pressable>
        </View>
      </View>

      <NotificationsSheet visible={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
