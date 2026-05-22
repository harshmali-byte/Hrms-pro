import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Label } from "@/components/ui/Typography";

interface Props extends TextInputProps {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  /** Show eye toggle when secureTextEntry is set */
  allowPasswordToggle?: boolean;
}

export function Input({
  label,
  icon: Icon,
  error,
  allowPasswordToggle,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const borderColor = error
    ? "border-danger"
    : focused
      ? "border-primary"
      : "border-border";
  const isSecure = allowPasswordToggle ? hidden : secureTextEntry;

  return (
    <View className="w-full">
      {label ? <Label className="mb-2">{label}</Label> : null}
      <View
        className={`min-h-[48px] flex-row items-center rounded-xl border bg-surface px-4 ${borderColor}`}
        style={
          focused
            ? { shadowColor: palette.primary, shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }
            : undefined
        }
      >
        {Icon ? (
          <Icon size={iconSizes.sm} color={palette.textMuted} style={{ marginRight: 10 }} />
        ) : null}
        <TextInput
          className="flex-1 py-3 text-base text-text"
          style={{ fontFamily: font.regular }}
          placeholderTextColor={palette.textSubtle}
          secureTextEntry={isSecure}
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
        {allowPasswordToggle ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={10}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            {hidden ? (
              <Eye size={iconSizes.sm} color={palette.textSubtle} />
            ) : (
              <EyeOff size={iconSizes.sm} color={palette.textSubtle} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={{ fontFamily: font.medium }} className="mt-1.5 text-xs text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
