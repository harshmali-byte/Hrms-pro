import { ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { breakpoints } from "@/constants/breakpoints";
import { font } from "@/constants/fonts";
import { palette, layout, shellShadowStyle } from "@/constants/theme";
import { useHrmsData } from "@/context/HrmsDataContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { ShellNavItem } from "@/navigation/shellNav";

interface Props {
  navItems: ShellNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  userName: string;
  userRole: string;
  avatarColor: string;
  onSignOut: () => void;
  children: ReactNode;
}

export function AppShell({
  navItems,
  activeId,
  onNavigate,
  pageTitle,
  pageSubtitle,
  userName,
  userRole,
  avatarColor,
  onSignOut,
  children,
}: Props) {
  const { isReady, apiError } = useHrmsData();
  const { width } = useWindowDimensions();
  const isDesktop = width >= breakpoints.lg;
  const collapsed = width >= breakpoints.md && width < breakpoints.lg;
  const shellPad = isDesktop ? layout.shellPaddingDesktop : layout.shellPadding;
  const sideW = collapsed ? layout.sidebarCollapsed : layout.sidebarWidth;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-canvas">
      <View className="flex-1" style={{ padding: shellPad }}>
        <View
          className="min-h-0 flex-1 flex-row overflow-hidden rounded-3xl bg-surface"
          style={[
            shellShadowStyle,
            Platform.OS === "web"
              ? { borderWidth: 1, borderColor: palette.border }
              : undefined,
          ]}
        >
          <View
            className="h-full shrink-0 grow-0"
            style={{ width: sideW, maxWidth: sideW, minWidth: sideW }}
          >
            <Sidebar
              items={navItems}
              activeId={activeId}
              onNavigate={onNavigate}
              userName={userName}
              userRole={userRole}
              avatarColor={avatarColor}
              onSignOut={onSignOut}
              collapsed={collapsed}
            />
          </View>

          <View className="min-w-0 flex-1 bg-background">
            <TopBar userName={userName} userRole={userRole} avatarColor={avatarColor} />

            {apiError ? (
              <View className="border-b border-danger/20 bg-danger-soft px-5 py-2.5">
                <Text style={{ fontFamily: font.medium }} className="text-sm text-danger">
                  {apiError} — Run `npm run server:dev` and `npm run server:seed`.
                </Text>
              </View>
            ) : null}

            {!isReady ? (
              <View className="flex-1 items-center justify-center py-24">
                <ActivityIndicator size="large" color={palette.primary} />
                <Text style={{ fontFamily: font.medium }} className="mt-4 text-sm text-textMuted">
                  Loading workspace…
                </Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{
                  paddingHorizontal: isDesktop ? 28 : 16,
                  paddingTop: isDesktop ? 28 : 20,
                  paddingBottom: 40,
                  maxWidth: layout.contentMaxWidth,
                  width: "100%",
                  alignSelf: "center",
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <PageHeader title={pageTitle} subtitle={pageSubtitle} />
                {children}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
