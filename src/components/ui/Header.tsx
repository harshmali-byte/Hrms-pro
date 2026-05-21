import { ReactNode } from "react";
import { View } from "react-native";
import { H1, Lead } from "@/components/ui/Typography";

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  /** Page title is in TopBar — only show subtitle/actions */
  embedded?: boolean;
}

export function Header({ title, subtitle, right, embedded = false }: Props) {
  if (embedded) {
    if (!subtitle && !right) return null;
    return (
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-1 pr-3">{subtitle ? <Lead>{subtitle}</Lead> : null}</View>
        {right ? <View>{right}</View> : null}
      </View>
    );
  }

  return (
    <View className="flex-row items-start justify-between py-2 pb-4">
      <View className="min-h-[44px] flex-1 justify-center pr-3">
        <H1>{title}</H1>
        {subtitle ? <Lead>{subtitle}</Lead> : null}
      </View>
      {right ? <View className="pt-0.5">{right}</View> : null}
    </View>
  );
}
