import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font } from "@/constants/fonts";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { HrmsNotification } from "@/types";

interface Props {
  notification: HrmsNotification | null;
  visible: boolean;
  onClose: () => void;
}

export function NotificationDetailModal({ notification, visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  if (!notification) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-center px-5"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
        onPress={onClose}
      >
        <View
          className="max-h-[80%] overflow-hidden rounded-2xl border border-border bg-surface"
          style={{ marginTop: insets.top, marginBottom: insets.bottom }}
          onStartShouldSetResponder={() => true}
        >
          <View className="border-b border-border px-5 py-4">
            <View className="flex-row items-start justify-between gap-3">
              <Text
                style={{ fontFamily: font.bold }}
                className="flex-1 text-lg text-text"
              >
                {notification.title}
              </Text>
              {!notification.read ? <Badge label="New" tone="primary" /> : null}
            </View>
            <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-textSubtle">
              {notification.createdAt}
            </Text>
          </View>

          <ScrollView
            className="px-5 py-4"
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{ fontFamily: font.regular }}
              className="text-base leading-7 text-text"
            >
              {notification.body}
            </Text>
          </ScrollView>

          <View className="border-t border-border px-5 py-4">
            <Button label="Close" variant="primary" fullWidth onPress={onClose} />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
