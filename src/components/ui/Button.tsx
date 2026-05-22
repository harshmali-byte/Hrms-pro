import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

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
};

const labelByVariant: Record<Variant, string> = {
  primary: "text-textInverse",
  secondary: "text-primary",
  ghost: "text-text",
  danger: "text-textInverse",
};

const iconColorByVariant: Record<Variant, string> = {
  primary: palette.textInverse,
  secondary: palette.primary,
  ghost: palette.text,
  danger: palette.textInverse,
};

const containerBySize: Record<Size, string> = {
  sm: "h-9 px-4 rounded-full",
  md: "h-11 px-5 rounded-full",
  lg: "h-12 px-6 rounded-full",
};

const labelBySize: Record<Size, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
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
      } ${isInactive ? "opacity-55" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={iconColorByVariant[variant]} size="small" />
      ) : (
        <>
          {Icon ? (
            <Icon
              size={iconSizes.sm}
              color={iconColorByVariant[variant]}
              style={{ marginRight: 8 }}
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
