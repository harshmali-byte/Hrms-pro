import { ReactNode } from "react";
import { Platform, View, ViewProps } from "react-native";
import { palette } from "@/constants/theme";

interface Props extends ViewProps {
  children: ReactNode;
  variant?: "default" | "muted" | "outline";
  padded?: boolean;
  className?: string;
  elevated?: boolean;
}

const variants: Record<NonNullable<Props["variant"]>, string> = {
  default: "bg-surface border border-border",
  muted: "bg-surfaceMuted border border-border",
  outline: "bg-transparent border border-border",
};

const shadowStyle = Platform.select({
  ios: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
  default: {},
});

export function Card({
  children,
  variant = "default",
  padded = true,
  elevated = true,
  className = "",
  style,
  ...rest
}: Props) {
  const padding = padded ? "p-5" : "";
  const elevation = variant === "default" && elevated ? shadowStyle : undefined;

  return (
    <View
      className={`${variants[variant]} rounded-xl ${padding} ${className}`}
      style={[elevation, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
