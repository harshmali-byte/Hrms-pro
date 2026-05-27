import { ReactNode } from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

interface Props {
  primaryLabel: string;
  onPrimary: () => void;
  primaryLoading?: boolean;
  primaryIcon?: LucideIcon;
  secondaryLabel?: string;
  onSecondary?: () => void;
  destructiveLabel?: string;
  onDestructive?: () => void;
  destructiveLoading?: boolean;
  destructiveIcon?: LucideIcon;
  /** Extra actions on the left (e.g. delete). */
  leading?: ReactNode;
}

/** Compact footer row for forms, sheets, and dialogs. */
export function FormActions({
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryIcon,
  secondaryLabel = "Cancel",
  onSecondary,
  destructiveLabel,
  onDestructive,
  destructiveLoading = false,
  destructiveIcon,
  leading,
}: Props) {
  return (
    <View className="flex-row flex-wrap items-center gap-2">
      {leading}
      {destructiveLabel && onDestructive ? (
        <Button
          label={destructiveLabel}
          variant="dangerOutline"
          size="sm"
          icon={destructiveIcon}
          onPress={onDestructive}
          loading={destructiveLoading}
        />
      ) : null}
      <View className="min-w-0 flex-1" />
      {onSecondary ? (
        <Button label={secondaryLabel} variant="secondary" size="sm" onPress={onSecondary} />
      ) : null}
      <Button
        label={primaryLabel}
        size="sm"
        icon={primaryIcon}
        onPress={onPrimary}
        loading={primaryLoading}
      />
    </View>
  );
}

/** Right-aligned single or paired actions (info dialogs). */
export function DialogActions({ children }: { children: ReactNode }) {
  return <View className="flex-row flex-wrap items-center justify-end gap-2">{children}</View>;
}
