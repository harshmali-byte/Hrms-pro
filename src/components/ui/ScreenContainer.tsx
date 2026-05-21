import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Inside AppShell — no extra safe area or outer scroll */
  embedded?: boolean;
}

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  embedded = false,
}: Props) {
  if (embedded) {
    return <>{children}</>;
  }

  const inner = padded ? "px-5 pt-3 pb-10" : "";

  if (!scroll) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <View className={`flex-1 ${inner}`}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName={inner}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
