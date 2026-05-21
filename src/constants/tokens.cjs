/**
 * Design tokens — HRMS reference (dark sidebar + light canvas).
 */

const colors = {
  primary: {
    DEFAULT: "#4F6BED",
    soft: "#E8EEFF",
    dark: "#3D56C4",
  },
  accent: "#4F6BED",

  background: "#F0F2F5",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F6F8",

  sidebar: {
    DEFAULT: "#1B2531",
    hover: "#243040",
    active: "#2A3544",
    border: "#2D3A4A",
    text: "#94A3B8",
    textActive: "#FFFFFF",
    accent: "#4F6BED",
  },

  text: "#1E293B",
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
    blue: "#4F6BED",
    green: "#10B981",
    orange: "#F97316",
    purple: "#8B5CF6",
    slate: "#64748B",
  },
};

const radius = {
  none: "0px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
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
  base: ["16px", { lineHeight: "24px" }],
  lg: ["18px", { lineHeight: "26px", letterSpacing: "-0.01em" }],
  xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.015em" }],
  "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
  "3xl": ["30px", { lineHeight: "38px", letterSpacing: "-0.02em" }],
};

const letterSpacing = {
  tight: "-0.02em",
  tighter: "-0.03em",
  normal: "0",
  wide: "0.02em",
};

module.exports = { colors, radius, spacing, fontSize, letterSpacing };
