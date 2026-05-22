import { Pressable, Text, View } from "react-native";
import {
  Building2,
  ChevronLeft,
  HelpCircle,
  LogOut,
  Settings,
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

function groupBySection(items: ShellNavItem[]) {
  const groups: { section: string; items: ShellNavItem[] }[] = [];
  for (const item of items) {
    const section = item.section ?? "Menu";
    const last = groups[groups.length - 1];
    if (last?.section === section) last.items.push(item);
    else groups.push({ section, items: [item] });
  }
  return groups;
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
  const groups = groupBySection(items);

  return (
    <View
      style={{
        width,
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: palette.sidebar,
        alignSelf: "stretch",
      }}
      className="h-full border-r border-sidebar-border"
    >
      <View
        className={`flex-row items-center border-b border-sidebar-border ${
          collapsed ? "justify-center px-2 py-4" : "gap-2.5 px-4 py-4"
        }`}
      >
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Building2 size={iconSizes.md} color={palette.textInverse} />
        </View>
        {!collapsed ? (
          <>
            <View className="min-w-0 flex-1">
              <Text
                style={{ fontFamily: font.bold }}
                className="text-base text-text"
                numberOfLines={1}
              >
                {APP.name}
              </Text>
              <Text style={{ fontFamily: font.regular }} className="text-[11px] text-textSubtle">
                HR Workspace
              </Text>
            </View>
            <Pressable className="h-8 w-8 items-center justify-center rounded-lg active:bg-sidebar-hover">
              <ChevronLeft size={16} color={palette.textSubtle} />
            </Pressable>
          </>
        ) : null}
      </View>

      <View className={`flex-1 ${collapsed ? "px-1.5 py-3" : "px-3 py-4"}`}>
        {groups.map(({ section, items: sectionItems }) => (
          <View key={section} className="mb-4">
            {!collapsed ? (
              <Text
                style={{ fontFamily: font.semibold, letterSpacing: 0.8 }}
                className="mb-2 px-2 text-[10px] uppercase text-textSubtle"
              >
                {section}
              </Text>
            ) : null}
            {sectionItems.map((item) => {
              const active = activeId === item.id;
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => onNavigate(item.id)}
                  className={`mb-1 flex-row items-center active:opacity-90 ${
                    collapsed ? "justify-center rounded-xl py-2.5" : "rounded-xl px-3 py-2.5"
                  }`}
                  style={{ backgroundColor: active ? palette.primary : "transparent" }}
                >
                  <Icon
                    size={iconSizes.sm}
                    color={active ? palette.textInverse : palette.sidebarText}
                  />
                  {!collapsed ? (
                    <>
                      <Text
                        style={{ fontFamily: active ? font.semibold : font.medium }}
                        className={`ml-3 flex-1 text-sm ${
                          active ? "text-textInverse" : "text-textMuted"
                        }`}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      {item.badge != null && item.badge > 0 ? (
                        <View className="min-w-[20px] items-center justify-center rounded-full bg-danger px-1.5 py-0.5">
                          <Text
                            style={{ fontFamily: font.bold }}
                            className="text-[10px] text-textInverse"
                          >
                            {item.badge > 9 ? "9+" : item.badge}
                          </Text>
                        </View>
                      ) : null}
                    </>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View className={`border-t border-sidebar-border ${collapsed ? "p-2" : "p-3"}`}>
        {!collapsed ? (
          <>
            <Pressable className="mb-1 flex-row items-center rounded-xl px-3 py-2 active:bg-sidebar-hover">
              <Settings size={iconSizes.sm} color={palette.sidebarText} />
              <Text style={{ fontFamily: font.medium }} className="ml-3 text-sm text-textMuted">
                Settings
              </Text>
            </Pressable>
            <Pressable className="mb-3 flex-row items-center rounded-xl px-3 py-2 active:bg-sidebar-hover">
              <HelpCircle size={iconSizes.sm} color={palette.sidebarText} />
              <Text style={{ fontFamily: font.medium }} className="ml-3 text-sm text-textMuted">
                Help Center
              </Text>
            </Pressable>
            <View className="mb-2 flex-row items-center rounded-xl bg-surfaceMuted px-2.5 py-2">
              <Avatar name={userName} color={avatarColor} size="sm" />
              <View className="ml-2.5 min-w-0 flex-1">
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
            </View>
          </>
        ) : null}
        <Pressable
          onPress={onSignOut}
          className={`flex-row items-center rounded-xl active:bg-danger-soft ${
            collapsed ? "justify-center py-2.5" : "px-3 py-2.5"
          }`}
        >
          <LogOut size={iconSizes.sm} color={palette.danger} />
          {!collapsed ? (
            <Text style={{ fontFamily: font.medium }} className="ml-3 text-sm text-danger">
              Log out
            </Text>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
