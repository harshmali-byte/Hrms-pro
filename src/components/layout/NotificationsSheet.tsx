import { Pressable, Text, View } from "react-native";
import { useHrmsData } from "@/context/HrmsDataContext";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { font } from "@/constants/fonts";
import { Inbox } from "lucide-react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsSheet({ visible, onClose }: Props) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHrmsData();

  return (
    <BottomSheet
      visible={visible}
      title="Notifications"
      onClose={onClose}
      footer={
        notifications.length > 0 ? (
          <Pressable onPress={markAllNotificationsRead} className="py-2">
            <Text style={{ fontFamily: font.semibold }} className="text-center text-sm text-primary">
              Mark all as read
            </Text>
          </Pressable>
        ) : undefined
      }
    >
      {notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="All caught up"
          description="New updates about leave, attendance, and policies appear here."
        />
      ) : (
        notifications.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => markNotificationRead(n.id)}
            className="mb-3 rounded-lg border border-border bg-surface p-3.5 active:bg-surfaceMuted"
          >
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: font.medium }} className="flex-1 pr-2 text-base text-text">
                {n.title}
              </Text>
              {!n.read ? <Badge label="New" tone="primary" /> : null}
            </View>
            <Text style={{ fontFamily: font.regular }} className="mt-1.5 text-sm leading-5 text-textMuted">
              {n.body}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-textSubtle">
              {n.createdAt}
            </Text>
          </Pressable>
        ))
      )}
    </BottomSheet>
  );
}
