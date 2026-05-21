export const palette = {
  primary: "#0D9488",
  primarySoft: "#CCFBF1",
  primaryDark: "#0F766E",
  accent: "#0D9488",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",

  sidebar: "#FFFFFF",
  sidebarHover: "#F8FAFC",
  sidebarActive: "#F0FDFA",
  sidebarBorder: "#E2E8F0",
  sidebarText: "#64748B",
  sidebarTextActive: "#0F766E",

  text: "#0F172A",
  textMuted: "#475569",
  textSubtle: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  borderStrong: "#CBD5E1",

  success: "#059669",
  successSoft: "#ECFDF5",
  warning: "#D97706",
  warningSoft: "#FFFBEB",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  info: "#0284C7",
  infoSoft: "#F0F9FF",

  chartBlue: "#0EA5E9",
  chartGreen: "#10B981",
  chartOrange: "#F97316",
  chartPurple: "#8B5CF6",
  chartSlate: "#64748B",
  chartTeal: "#14B8A6",

  shadow: "rgba(15, 23, 42, 0.06)",
} as const;

export const layout = {
  /** Desktop app rail (dashboard & modules) — keep narrow */
  sidebarWidth: 200,
  /** Mobile/tablet drawer — roomier for touch */
  sidebarDrawerWidth: 260,
  topBarHeight: 56,
  contentMaxWidth: 1280,
  paddingMobile: 16,
  paddingDesktop: 28,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
} as const;

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;
