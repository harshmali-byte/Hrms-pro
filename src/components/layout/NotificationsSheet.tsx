import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useHrmsData } from "@/context/HrmsDataContext";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Inbox } from "lucide-react-native";
import type { HrmsNotification } from "@/types";
import { NotificationDetailModal } from "./NotificationDetailModal";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsSheet({ visible, onClose }: Props) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHrmsData();
  const [selected, setSelected] = useState<HrmsNotification | null>(null);

  const openDetail = (n: HrmsNotification) => {
    if (!n.read) markNotificationRead(n.id);
    setSelected(n);
  };

  const closeDetail = () => setSelected(null);

  return (
    <>
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
              onPress={() => openDetail(n)}
              className="mb-3 flex-row items-center rounded-xl border border-border bg-surface p-3.5 active:bg-surfaceMuted"
            >
              <View className="min-w-0 flex-1">
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{ fontFamily: font.semibold }}
                    className="flex-1 pr-2 text-base text-text"
                    numberOfLines={1}
                  >
                    {n.title}
                  </Text>
                  {!n.read ? <Badge label="New" tone="primary" /> : null}
                </View>
                <Text
                  style={{ fontFamily: font.regular }}
                  className="mt-1.5 text-sm leading-5 text-textMuted"
                  numberOfLines={2}
                >
                  {n.body}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-textSubtle">
                  {n.createdAt} · Tap to read full message
                </Text>
              </View>
              <ChevronRight size={iconSizes.sm} color={palette.textSubtle} style={{ marginLeft: 8 }} />
            </Pressable>
          ))
        )}
      </BottomSheet>

      <NotificationDetailModal
        notification={selected}
        visible={selected != null}
        onClose={closeDetail}
      />
    </>
  );
}
