import { Alert, Pressable, Text, View } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import type { LeaveRequest, LeaveStatus, LeaveType } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const statusToTone: Record<LeaveStatus, BadgeTone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const leaveTypeLabel: Record<LeaveType, string> = {
  casual: "Casual leave",
  sick: "Sick leave",
  earned: "Earned leave",
  unpaid: "Unpaid leave",
};

interface Props {
  request: LeaveRequest;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  showEmployee?: boolean;
  detailInSheet?: boolean;
  onOpenDetail?: (request: LeaveRequest) => void;
}

function detailMessage(r: LeaveRequest, showEmployee: boolean) {
  const lines = [
    showEmployee ? `Employee: ${r.employeeName}` : null,
    `Type: ${leaveTypeLabel[r.type]}`,
    `Dates: ${r.from} → ${r.to} (${r.days} working days)`,
    `Reason: ${r.reason}`,
    `Applied: ${r.appliedOn}`,
    `Status: ${r.status}`,
  ].filter(Boolean) as string[];
  return lines.join("\n");
}

export function LeaveRequestCard({
  request,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  showEmployee = false,
  detailInSheet = false,
  onOpenDetail,
}: Props) {
  const showDetail = () => {
    if (onOpenDetail) {
      onOpenDetail(request);
      return;
    }
    Alert.alert("Leave request", detailMessage(request, showEmployee));
  };

  return (
    <Card elevated={false}>
      <Pressable
        onPress={showDetail}
        disabled={detailInSheet && !onOpenDetail}
        accessibilityRole="button"
        accessibilityLabel="View leave request details"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            {showEmployee ? (
              <Text style={{ fontFamily: font.semibold }} className="text-sm text-text">
                {request.employeeName}
              </Text>
            ) : null}
            <Text
              style={{ fontFamily: showEmployee ? font.regular : font.semibold }}
              className={`${showEmployee ? "text-xs text-textMuted" : "text-sm text-text"}`}
            >
              {leaveTypeLabel[request.type]}
            </Text>

            <View className="mt-2 flex-row items-center">
              <CalendarDays size={iconSizes.xs} color={palette.textMuted} />
              <Text style={{ fontFamily: font.regular }} className="ml-1.5 text-sm text-textMuted">
                {request.from === request.to
                  ? request.from
                  : `${request.from} → ${request.to}`}
              </Text>
              <Text style={{ fontFamily: font.regular }} className="ml-2 text-sm text-textMuted">
                · {request.days}d
              </Text>
            </View>

            <Text
              style={{ fontFamily: font.regular }}
              numberOfLines={2}
              className="mt-2 text-sm text-textMuted"
            >
              {request.reason}
            </Text>
          </View>

          <Badge label={request.status} tone={statusToTone[request.status]} />
        </View>
      </Pressable>

      {showActions && request.status === "pending" ? (
        <View className="mt-4 flex-row justify-end gap-2">
          <Button label="Reject" variant="secondary" size="sm" onPress={() => onReject?.(request.id)} />
          <Button label="Approve" size="sm" onPress={() => onApprove?.(request.id)} />
        </View>
      ) : null}

      {onCancel && request.status === "pending" ? (
        <View className="mt-3 flex-row justify-end">
          <Button
            label="Withdraw request"
            variant="dangerOutline"
            size="sm"
            onPress={() => onCancel(request.id)}
          />
        </View>
      ) : null}
    </Card>
  );
}
