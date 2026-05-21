export const palette = {
  primary: "#4F6BED",
  primarySoft: "#E8EEFF",
  primaryDark: "#3D56C4",
  accent: "#4F6BED",

  background: "#F0F2F5",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F6F8",

  sidebar: "#1B2531",
  sidebarHover: "#243040",
  sidebarActive: "#2A3544",
  sidebarBorder: "#2D3A4A",
  sidebarText: "#94A3B8",
  sidebarTextActive: "#FFFFFF",

  text: "#1E293B",
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

  chartBlue: "#4F6BED",
  chartGreen: "#10B981",
  chartOrange: "#F97316",
  chartPurple: "#8B5CF6",
  chartSlate: "#64748B",

  shadow: "rgba(15, 23, 42, 0.06)",
} as const;

export type PaletteColor = keyof typeof palette;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
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
  sidebarWidth: 260,
  sidebarCollapsed: 72,
  topBarHeight: 64,
} as const;
