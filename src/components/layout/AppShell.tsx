import { ReactNode, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "@/constants/fonts";
import { palette, layout } from "@/constants/theme";
import { useHrmsData } from "@/context/HrmsDataContext";
import { useResponsive } from "@/hooks/useResponsive";
import { Page } from "@/components/ui/Page";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNavDrawer } from "./MobileNavDrawer";
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
  const { showSidebar, useDrawer, contentPadding, isDesktop } = useResponsive();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="min-h-full flex-1 flex-row">
        {showSidebar ? (
          <View
            className="h-full shrink-0 grow-0"
            style={{
              width: layout.sidebarWidth,
              maxWidth: layout.sidebarWidth,
              minWidth: layout.sidebarWidth,
            }}
          >
            <Sidebar
              items={navItems}
              activeId={activeId}
              onNavigate={onNavigate}
              userName={userName}
              userRole={userRole}
              avatarColor={avatarColor}
              onSignOut={onSignOut}
              variant="rail"
            />
          </View>
        ) : null}

        <View className="min-w-0 flex-1">
          <TopBar
            title={pageTitle}
            userName={userName}
            avatarColor={avatarColor}
            onMenuPress={useDrawer ? () => setDrawerOpen(true) : undefined}
          />

          {apiError ? (
            <View className="border-b border-danger/20 bg-danger-soft px-4 py-2.5 md:px-7">
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
              className="flex-1 bg-background"
              contentContainerStyle={{
                paddingHorizontal: contentPadding,
                paddingTop: isDesktop ? 24 : 16,
                paddingBottom: 40,
                alignItems: "center",
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ width: "100%", maxWidth: layout.contentMaxWidth }}>
                <Page>{children}</Page>
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      {useDrawer ? (
        <MobileNavDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          items={navItems}
          activeId={activeId}
          onNavigate={onNavigate}
          userName={userName}
          userRole={userRole}
          avatarColor={avatarColor}
          onSignOut={onSignOut}
        />
      ) : null}
    </SafeAreaView>
  );
}
