import { Pressable, Text, View } from "react-native";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react-native";
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
  collapsed?: boolean;
}

export function Sidebar({
  items,
  activeId,
  onNavigate,
  userName,
  userRole,
  avatarColor,
  onSignOut,
  collapsed = false,
}: Props) {
  const width = collapsed ? layout.sidebarCollapsed : layout.sidebarWidth;

  return (
    <View
      style={{ width, backgroundColor: palette.sidebar }}
      className="border-r border-sidebar-border"
    >
      <View className="flex-row items-center gap-2 border-b border-sidebar-border px-4 py-5">
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Building2 size={iconSizes.md} color={palette.textInverse} />
        </View>
        {!collapsed ? (
          <Text style={{ fontFamily: font.bold }} className="text-lg text-textInverse">
            {APP.name}
          </Text>
        ) : null}
      </View>

      <View className="flex-1 px-2 py-3">
        {items.map((item) => {
          const active = activeId === item.id;
          const Icon = item.icon;
          return (
            <View key={item.id} className="mb-0.5">
              <Pressable
                onPress={() => onNavigate(item.id)}
                className="flex-row items-center rounded-md px-3 py-2.5 active:opacity-90"
                style={{
                  backgroundColor: active ? palette.sidebarActive : "transparent",
                  borderLeftWidth: active ? 3 : 0,
                  borderLeftColor: active ? palette.primary : "transparent",
                }}
              >
                <Icon
                  size={iconSizes.sm}
                  color={active ? palette.sidebarTextActive : palette.sidebarText}
                />
                {!collapsed ? (
                  <>
                    <Text
                      style={{ fontFamily: font.medium }}
                      className={`ml-3 flex-1 text-sm ${
                        active ? "text-textInverse" : "text-sidebar-text"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {item.children ? (
                      <ChevronDown
                        size={14}
                        color={active ? palette.sidebarTextActive : palette.sidebarText}
                      />
                    ) : null}
                  </>
                ) : null}
              </Pressable>
              {active && item.children && !collapsed ? (
                <View className="ml-9 mt-0.5 mb-1">
                  {item.children.map((child, idx) => (
                    <Pressable
                      key={`${child.id}-${idx}`}
                      onPress={() => onNavigate(item.id)}
                      className="flex-row items-center py-1.5"
                    >
                      <ChevronRight size={12} color={palette.sidebarText} />
                      <Text
                        style={{ fontFamily: font.regular }}
                        className="ml-1 text-xs text-sidebar-text"
                      >
                        {child.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <View className="border-t border-sidebar-border p-3">
        <View className="flex-row items-center rounded-lg bg-sidebar-hover px-2 py-2">
          <Avatar name={userName} color={avatarColor} size="sm" />
          {!collapsed ? (
            <View className="ml-2 flex-1">
              <Text style={{ fontFamily: font.semibold }} className="text-sm text-textInverse">
                {userName}
              </Text>
              <Text style={{ fontFamily: font.regular }} className="text-xs text-sidebar-text">
                {userRole}
              </Text>
            </View>
          ) : null}
          {!collapsed ? (
            <Pressable onPress={onSignOut} hitSlop={8}>
              <X size={16} color={palette.sidebarText} />
            </Pressable>
          ) : null}
        </View>
        {collapsed ? (
          <Pressable onPress={onSignOut} className="mt-2 items-center py-2">
            <LogOut size={iconSizes.sm} color={palette.sidebarText} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
