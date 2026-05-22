/**
 * HRMS — modern SaaS tokens (reference: light shell, blue accent, white sidebar).
 */

const colors = {
  primary: {
    DEFAULT: "#0066FF",
    soft: "#E8F1FF",
    dark: "#0052CC",
  },
  accent: "#0066FF",

  canvas: "#E8EFF9",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F3F5",

  sidebar: {
    DEFAULT: "#FFFFFF",
    hover: "#F8F9FA",
    active: "#0066FF",
    border: "#E8ECF4",
    text: "#64748B",
    textActive: "#FFFFFF",
    accent: "#0066FF",
  },

  text: "#0F172A",
  textMuted: "#64748B",
  textSubtle: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  borderStrong: "#CBD5E1",

  success: { DEFAULT: "#10B981", soft: "#ECFDF5" },
  warning: { DEFAULT: "#F59E0B", soft: "#FFFBEB" },
  danger: { DEFAULT: "#EF4444", soft: "#FEF2F2" },
  info: { DEFAULT: "#3B82F6", soft: "#EFF6FF" },

  chart: {
    blue: "#0066FF",
    green: "#10B981",
    orange: "#F97316",
    purple: "#8B5CF6",
    slate: "#64748B",
    pink: "#EC4899",
  },
};

const radius = {
  none: "0px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "28px",
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
  xs: ["12px", { lineHeight: "16px" }],
  sm: ["14px", { lineHeight: "20px" }],
  base: ["15px", { lineHeight: "22px" }],
  lg: ["18px", { lineHeight: "26px", letterSpacing: "-0.015em" }],
  xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.02em" }],
  "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
  "3xl": ["30px", { lineHeight: "38px", letterSpacing: "-0.025em" }],
};

const letterSpacing = {
  tight: "-0.02em",
  tighter: "-0.03em",
  normal: "0",
  wide: "0.05em",
};

const boxShadow = {
  shell: "0 8px 32px rgba(15, 23, 42, 0.08)",
  card: "0 4px 16px rgba(15, 23, 42, 0.06)",
  sm: "0 1px 3px rgba(15, 23, 42, 0.06)",
};

module.exports = { colors, radius, spacing, fontSize, letterSpacing, boxShadow };
