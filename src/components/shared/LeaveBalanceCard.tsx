import { Alert, Pressable, Text, View } from "react-native";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import type { LeaveBalance, LeaveType } from "@/types";
import { Card } from "@/components/ui/Card";

const labelByType: Record<LeaveType, string> = {
  casual: "Casual",
  sick: "Sick",
  earned: "Earned",
  unpaid: "Unpaid",
};

const accentByType: Record<LeaveType, string> = {
  casual: palette.primary,
  sick: palette.danger,
  earned: palette.success,
  unpaid: palette.textMuted,
};

interface Props {
  balance: LeaveBalance;
}

export function LeaveBalanceCard({ balance }: Props) {
  const remaining = Math.max(0, balance.total - balance.used);
  const ratio = balance.total === 0 ? 0 : Math.min(1, balance.used / balance.total);
  const accent = accentByType[balance.type];
  const label = labelByType[balance.type];

  const showPolicy = () => {
    Alert.alert(
      `${label} leave`,
      [
        `Balance: ${remaining} of ${balance.total} days remaining`,
        `Used this cycle: ${balance.used}`,
        "",
        "Demo: policy text and carry-forward rules would appear here.",
      ].join("\n"),
    );
  };

  return (
    <Pressable onPress={showPolicy} className="flex-1 active:opacity-90" accessibilityRole="button">
      <Card className="flex-1" elevated={false}>
        <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
          {label}
        </Text>
        <View className="mt-2 flex-row items-baseline">
          <Text style={{ fontFamily: font.bold }} className="text-2xl text-text">
            {remaining}
          </Text>
          <Text style={{ fontFamily: font.regular }} className="ml-1 text-sm text-textMuted">
            / {balance.total}
          </Text>
        </View>

        <View className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surfaceMuted">
          <View
            className="h-full rounded-full"
            style={{ width: `${ratio * 100}%`, backgroundColor: accent }}
          />
        </View>
        <Text style={{ fontFamily: font.regular }} className="mt-1.5 text-xs text-textMuted">
          {balance.used} used · tap for policy
        </Text>
      </Card>
    </Pressable>
  );
}
