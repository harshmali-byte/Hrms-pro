import { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Label } from "@/components/ui/Typography";

interface Props extends TextInputProps {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export function Input({ label, icon: Icon, error, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? "border-danger"
    : focused
      ? "border-primary"
      : "border-border";

  return (
    <View className="w-full">
      {label ? <Label className="mb-2">{label}</Label> : null}
      <View
        className={`min-h-[48px] flex-row items-center rounded-xl border bg-surfaceMuted px-4 ${borderColor}`}
      >
        {Icon ? (
          <Icon size={iconSizes.sm} color={palette.textMuted} style={{ marginRight: 10 }} />
        ) : null}
        <TextInput
          className="flex-1 py-3 text-base text-text"
          style={{ fontFamily: font.regular }}
          placeholderTextColor={palette.textSubtle}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error ? (
        <Text style={{ fontFamily: font.medium }} className="mt-1.5 text-xs text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
