import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { palette, iconSizes } from "@/constants/theme";
import type { Employee } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const statusToTone: Record<Employee["status"], BadgeTone> = {
  active: "success",
  onLeave: "warning",
  probation: "info",
};

const statusToLabel: Record<Employee["status"], string> = {
  active: "Active",
  onLeave: "On leave",
  probation: "Probation",
};

interface Props {
  employee: Employee;
  onPress?: (employee: Employee) => void;
}

export function EmployeeListItem({ employee, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(employee)}
      disabled={!onPress}
      accessibilityState={{ disabled: !onPress }}
      className={`flex-row items-center rounded-lg border border-border bg-surface p-3 ${
        onPress ? "active:bg-surfaceMuted" : "opacity-60"
      }`}
    >
      <Avatar name={employee.name} color={employee.avatarColor} size="md" />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text numberOfLines={1} className="flex-1 text-base font-medium text-text">
            {employee.name}
          </Text>
          <Badge label={statusToLabel[employee.status]} tone={statusToTone[employee.status]} />
        </View>
        <Text numberOfLines={1} className="mt-0.5 text-sm text-textMuted">
          {employee.role} · {employee.department}
        </Text>
      </View>
      <ChevronRight size={iconSizes.sm} color={palette.textSubtle} style={{ marginLeft: 8 }} />
    </Pressable>
  );
}
