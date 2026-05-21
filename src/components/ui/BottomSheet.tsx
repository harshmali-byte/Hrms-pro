import { ReactNode } from "react";
import {
  Modal,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Typography";

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close sheet backdrop"
        />
        <View
          className="rounded-t-3xl border border-b-0 border-border bg-surface"
          style={{
            maxHeight: "88%",
            paddingBottom: Math.max(insets.bottom, 16),
          }}
          onStartShouldSetResponder={() => true}
        >
          <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <SectionTitle className="flex-1 pr-2" numberOfLines={1}>
              {title}
            </SectionTitle>
            <Button label="Done" variant="ghost" size="sm" onPress={onClose} />
          </View>
          <ScrollView
            className="px-5 pt-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
            <View className="h-4" />
          </ScrollView>
          {footer ? <View className="border-t border-border px-5 pt-3">{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
