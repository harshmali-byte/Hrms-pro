import { ReactNode } from "react";
import { View } from "react-native";
import { H1, Lead } from "@/components/ui/Typography";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <View className="mb-6 flex-row flex-wrap items-start justify-between gap-4">
      <View className="min-w-0 flex-1">
        <H1>{title}</H1>
        {subtitle ? <Lead>{subtitle}</Lead> : null}
      </View>
      {actions ? <View className="flex-row flex-wrap items-center gap-2">{actions}</View> : null}
    </View>
  );
}
