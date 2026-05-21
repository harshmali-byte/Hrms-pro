/**
 * Organiq Web — design tokens (web-first, light shell).
 */

const colors = {
  primary: {
    DEFAULT: "#0D9488",
    soft: "#CCFBF1",
    dark: "#0F766E",
  },
  accent: "#0D9488",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",
  surfaceElevated: "#FFFFFF",

  sidebar: {
    DEFAULT: "#FFFFFF",
    hover: "#F8FAFC",
    active: "#F0FDFA",
    border: "#E2E8F0",
    text: "#64748B",
    textActive: "#0F766E",
    accent: "#0D9488",
  },

  text: "#0F172A",
  textMuted: "#475569",
  textSubtle: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  borderStrong: "#CBD5E1",

  success: { DEFAULT: "#059669", soft: "#ECFDF5" },
  warning: { DEFAULT: "#D97706", soft: "#FFFBEB" },
  danger: { DEFAULT: "#DC2626", soft: "#FEF2F2" },
  info: { DEFAULT: "#0284C7", soft: "#F0F9FF" },

  chart: {
    blue: "#0EA5E9",
    green: "#10B981",
    orange: "#F97316",
    purple: "#8B5CF6",
    slate: "#64748B",
    teal: "#14B8A6",
  },
};

const radius = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
  "2xl": "24px",
  full: "9999px",
};

const spacing = {
  0: "0px",
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
};

const fontSize = {
  xs: ["12px", { lineHeight: "18px" }],
  sm: ["14px", { lineHeight: "22px" }],
  base: ["15px", { lineHeight: "24px" }],
  lg: ["17px", { lineHeight: "26px", letterSpacing: "-0.01em" }],
  xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.015em" }],
  "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
  "3xl": ["30px", { lineHeight: "38px", letterSpacing: "-0.025em" }],
};

const letterSpacing = {
  tight: "-0.02em",
  tighter: "-0.03em",
  normal: "0",
  wide: "0.02em",
};

const boxShadow = {
  card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
  cardHover: "0 4px 12px -2px rgb(15 23 42 / 0.08)",
  shell: "0 1px 0 0 rgb(15 23 42 / 0.05)",
};

module.exports = { colors, radius, spacing, fontSize, letterSpacing, boxShadow };
