import { ReactNode } from "react";
import { Text, View } from "react-native";
import { font } from "@/constants/fonts";

interface Props {
  title: string;
  hint?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Clear section block for module screens */
export function PageSection({ title, hint, right, children, className = "" }: Props) {
  return (
    <View className={`mb-6 ${className}`}>
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
            {title}
          </Text>
          {hint ? (
            <Text style={{ fontFamily: font.regular }} className="mt-1 text-sm text-textMuted">
              {hint}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}
