import { Platform } from "react-native";

export const palette = {
  primary: "#0066FF",
  primarySoft: "#E8F1FF",
  primaryDark: "#0052CC",
  accent: "#0066FF",

  canvas: "#E8EFF9",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F3F5",

  sidebar: "#FFFFFF",
  sidebarHover: "#F8F9FA",
  sidebarActive: "#0066FF",
  sidebarBorder: "#E8ECF4",
  sidebarText: "#64748B",
  sidebarTextActive: "#FFFFFF",

  text: "#0F172A",
  textMuted: "#64748B",
  textSubtle: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  borderStrong: "#CBD5E1",

  success: "#10B981",
  successSoft: "#ECFDF5",
  warning: "#F59E0B",
  warningSoft: "#FFFBEB",
  danger: "#EF4444",
  dangerSoft: "#FEF2F2",
  info: "#3B82F6",
  infoSoft: "#EFF6FF",

  chartBlue: "#0066FF",
  chartGreen: "#10B981",
  chartOrange: "#F97316",
  chartPurple: "#8B5CF6",
  chartSlate: "#64748B",

  shadow: "rgba(15, 23, 42, 0.08)",
} as const;

export type PaletteColor = keyof typeof palette;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  shell: 24,
  full: 9999,
} as const;

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export const layout = {
  sidebarWidth: 220,
  sidebarCollapsed: 72,
  topBarHeight: 64,
  shellPadding: 16,
  shellPaddingDesktop: 20,
  contentMaxWidth: 1280,
} as const;

export const shellShadowStyle = Platform.select({
  web: { boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08)" },
  ios: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
  },
  android: { elevation: 8 },
  default: {},
});

export const cardShadowStyle = Platform.select({
  web: { boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)" },
  ios: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
  default: {},
});
