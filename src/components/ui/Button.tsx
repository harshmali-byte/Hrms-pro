import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dangerOutline";
type Size = "xs" | "sm" | "md" | "lg";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const containerByVariant: Record<Variant, string> = {
  primary: "bg-primary active:opacity-90",
  secondary: "border border-border bg-surface active:bg-surfaceMuted",
  ghost: "bg-transparent active:bg-surfaceMuted",
  danger: "bg-danger active:opacity-90",
  dangerOutline: "border border-danger/25 bg-dangerSoft active:opacity-90",
};

const labelByVariant: Record<Variant, string> = {
  primary: "text-textInverse",
  secondary: "text-text",
  ghost: "text-textMuted",
  danger: "text-textInverse",
  dangerOutline: "text-danger",
};

const iconColorByVariant: Record<Variant, string> = {
  primary: palette.textInverse,
  secondary: palette.text,
  ghost: palette.textMuted,
  danger: palette.textInverse,
  dangerOutline: palette.danger,
};

const containerBySize: Record<Size, string> = {
  xs: "h-7 px-2.5 rounded-lg",
  sm: "h-8 px-3 rounded-lg",
  md: "h-9 px-4 rounded-lg",
  lg: "h-10 px-5 rounded-xl",
};

const labelBySize: Record<Size, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

const iconSizeByButtonSize: Record<Size, number> = {
  xs: iconSizes.xs,
  sm: iconSizes.xs,
  md: iconSizes.sm,
  lg: iconSizes.sm,
};

const iconGapBySize: Record<Size, number> = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 6,
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "sm",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: Props): ReactNode {
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      className={`flex-row items-center justify-center ${containerBySize[size]} ${containerByVariant[variant]} ${
        fullWidth ? "w-full" : ""
      } ${isInactive ? "opacity-50" : ""}`}
      style={({ pressed }) =>
        pressed && !isInactive ? ({ opacity: 0.92 } as ViewStyle) : undefined
      }
    >
      {loading ? (
        <ActivityIndicator color={iconColorByVariant[variant]} size="small" />
      ) : (
        <>
          {Icon ? (
            <Icon
              size={iconSizeByButtonSize[size]}
              color={iconColorByVariant[variant]}
              style={{ marginRight: iconGapBySize[size] }}
            />
          ) : null}
          <Text
            style={{ fontFamily: font.semibold }}
            className={`${labelBySize[size]} ${labelByVariant[variant]}`}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
