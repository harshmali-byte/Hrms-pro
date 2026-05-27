import { Text } from "react-native";
import { font } from "@/constants/fonts";
import { Badge } from "@/components/ui/Badge";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { HrmsNotification } from "@/types";

interface Props {
  notification: HrmsNotification | null;
  visible: boolean;
  onClose: () => void;
}

export function NotificationDetailModal({ notification, visible, onClose }: Props) {
  if (!notification) return null;

  return (
    <BottomSheet visible={visible} title={notification.title} onClose={onClose} desktopWidth="md">
      <Text style={{ fontFamily: font.regular }} className="mb-3 text-xs text-textSubtle">
        {notification.createdAt}
      </Text>
      {!notification.read ? <Badge label="New" tone="primary" /> : null}
      <Text style={{ fontFamily: font.regular }} className="mt-4 text-sm leading-6 text-text">
        {notification.body}
      </Text>
    </BottomSheet>
  );
}
