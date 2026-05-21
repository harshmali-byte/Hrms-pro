import { Pressable, Text, View } from "react-native";
import { Building2, ChevronDown, LogOut } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes, layout } from "@/constants/theme";
import { APP } from "@/constants/strings";
import { Avatar } from "@/components/ui/Avatar";
import type { ShellNavItem } from "@/navigation/shellNav";

interface Props {
  items: ShellNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  userName: string;
  userRole: string;
  avatarColor: string;
  onSignOut: () => void;
  variant?: "rail" | "drawer";
}

export function Sidebar({
  items,
  activeId,
  onNavigate,
  userName,
  userRole,
  avatarColor,
  onSignOut,
  variant = "rail",
}: Props) {
  const isRail = variant === "rail";
  const width = isRail ? layout.sidebarWidth : layout.sidebarDrawerWidth;

  return (
    <View
      style={{
        width,
        backgroundColor: palette.sidebar,
        ...(isRail
          ? {
              flexGrow: 0,
              flexShrink: 0,
              maxWidth: width,
              minWidth: width,
              alignSelf: "stretch",
            }
          : { flex: 1 }),
      }}
      className={`border-r border-sidebar-border ${isRail ? "h-full" : ""}`}
    >
      <View
        className={`flex-row items-center border-b border-sidebar-border ${
          isRail ? "gap-2 px-3 py-3" : "gap-3 px-5 py-5"
        }`}
      >
        <View
          className={`items-center justify-center rounded-lg bg-primary ${
            isRail ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl"
          }`}
        >
          <Building2 size={isRail ? iconSizes.sm : iconSizes.md} color={palette.textInverse} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            style={{ fontFamily: font.bold }}
            className={isRail ? "text-base text-text" : "text-lg text-text"}
            numberOfLines={1}
          >
            {APP.name}
          </Text>
          {!isRail ? (
            <Text style={{ fontFamily: font.regular }} className="text-xs text-textSubtle">
              Workspace
            </Text>
          ) : null}
        </View>
      </View>

      <View className={`flex-1 ${isRail ? "px-2 py-3" : "px-3 py-4"}`}>
        {!isRail ? (
          <Text
            style={{ fontFamily: font.semibold }}
            className="mb-2 px-3 text-[11px] uppercase tracking-wider text-textSubtle"
          >
            Menu
          </Text>
        ) : null}
        {items.map((item) => {
          const active = activeId === item.id;
          const Icon = item.icon;
          return (
            <View key={item.id} className="mb-0.5">
              <Pressable
                onPress={() => onNavigate(item.id)}
                className={`flex-row items-center rounded-lg active:opacity-90 ${
                  isRail ? "px-2 py-2" : "px-3 py-2.5"
                }`}
                style={{
                  backgroundColor: active ? palette.sidebarActive : "transparent",
                }}
              >
                <View
                  className={`items-center justify-center rounded-md ${
                    isRail ? "h-7 w-7" : "h-8 w-8"
                  }`}
                  style={{
                    backgroundColor: active ? palette.primarySoft : "transparent",
                  }}
                >
                  <Icon
                    size={isRail ? 15 : iconSizes.sm}
                    color={active ? palette.primary : palette.sidebarText}
                  />
                </View>
                <Text
                  style={{ fontFamily: active ? font.semibold : font.medium }}
                  className={`ml-2 flex-1 ${isRail ? "text-xs" : "text-sm"} ${
                    active ? "text-sidebar-textActive" : "text-sidebar-text"
                  }`}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                {item.children && !isRail ? (
                  <ChevronDown
                    size={14}
                    color={active ? palette.primary : palette.textSubtle}
                  />
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </View>

      <View className={`border-t border-sidebar-border ${isRail ? "p-2.5" : "p-4"}`}>
        <View
          className={`flex-row items-center rounded-lg border border-border bg-surfaceMuted ${
            isRail ? "px-2 py-2" : "rounded-xl px-3 py-3"
          }`}
        >
          <Avatar name={userName} color={avatarColor} size="sm" />
          <View className="ml-2 min-w-0 flex-1">
            <Text
              style={{ fontFamily: font.semibold }}
              className="text-xs text-text"
              numberOfLines={1}
            >
              {userName}
            </Text>
            <Text
              style={{ fontFamily: font.regular }}
              className="text-[10px] text-textMuted"
              numberOfLines={1}
            >
              {userRole}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onSignOut}
          className={`mt-2 flex-row items-center justify-center rounded-lg border border-border active:bg-surfaceMuted ${
            isRail ? "py-2" : "py-2.5"
          }`}
          accessibilityLabel="Sign out"
        >
          <LogOut size={isRail ? 14 : iconSizes.sm} color={palette.textMuted} />
          {!isRail ? (
            <Text style={{ fontFamily: font.medium }} className="ml-2 text-sm text-textMuted">
              Sign out
            </Text>
          ) : (
            <Text style={{ fontFamily: font.medium }} className="ml-1.5 text-xs text-textMuted">
              Out
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
