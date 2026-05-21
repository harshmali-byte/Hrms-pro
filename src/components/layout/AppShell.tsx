import { ReactNode } from "react";
import { ActivityIndicator, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import { useHrmsData } from "@/context/HrmsDataContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { ShellNavItem } from "@/navigation/shellNav";

interface Props {
  navItems: ShellNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  pageTitle: string;
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
  userName,
  userRole,
  avatarColor,
  onSignOut,
  children,
}: Props) {
  const { isReady, apiError } = useHrmsData();
  const { width } = useWindowDimensions();
  const collapsed = width < 900;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-1 flex-row">
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
        <View className="min-w-0 flex-1">
          <TopBar title={pageTitle} userName={userName} avatarColor={avatarColor} />
          {apiError ? (
            <View className="border-b border-danger/30 bg-danger/10 px-4 py-2">
              <Text style={{ fontFamily: font.medium }} className="text-xs text-danger">
                API: {apiError}. Start PostgreSQL and run `npm run server:seed` in the project root.
              </Text>
            </View>
          ) : null}
          {!isReady ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={palette.primary} />
              <Text style={{ fontFamily: font.medium }} className="mt-3 text-sm text-textMuted">
                Loading workspace…
              </Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1 bg-background"
              contentContainerClassName="p-4 pb-10 md:p-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
