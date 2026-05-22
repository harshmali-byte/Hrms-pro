import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { cardShadowStyle } from "@/constants/theme";

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
  const elevation = variant === "default" && elevated ? cardShadowStyle : undefined;

  return (
    <View
      className={`${variants[variant]} rounded-2xl ${padding} ${className}`}
      style={[elevation, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
