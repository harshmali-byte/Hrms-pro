import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { palette } from "@/constants/theme";
import { font } from "@/constants/fonts";

export const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: palette.primary,
  tabBarInactiveTintColor: palette.textSubtle,
  tabBarLabelStyle: {
    fontSize: 11,
    fontFamily: font.medium,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  tabBarStyle: {
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    height: 62,
    paddingTop: 6,
    paddingBottom: 6,
    elevation: 8,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
};