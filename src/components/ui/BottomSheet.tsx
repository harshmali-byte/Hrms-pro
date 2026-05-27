import { ReactNode } from "react";
import {
  Modal,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Typography";
import { useIsDesktopOverlay } from "@/hooks/useIsDesktopOverlay";
import { palette, iconSizes, shellShadowStyle } from "@/constants/theme";

export type OverlayDesktopWidth = "sm" | "md" | "lg" | "xl";

const desktopMaxWidth: Record<OverlayDesktopWidth, number> = {
  sm: 420,
  md: 560,
  lg: 680,
  xl: 800,
};

const BACKDROP = "rgba(15, 23, 42, 0.5)";

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Optional header action (desktop: beside title; mobile: above footer). */
  headerAction?: ReactNode;
  desktopWidth?: OverlayDesktopWidth;
  /** Force bottom drawer even on large screens. */
  forceMobileSheet?: boolean;
}

/**
 * Responsive overlay used app-wide:
 * - Mobile / narrow: bottom drawer
 * - Desktop (≥1024px): centered modal dialog
 */
export function BottomSheet({
  visible,
  title,
  onClose,
  children,
  footer,
  headerAction,
  desktopWidth = "md",
  forceMobileSheet = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const isDesktop = useIsDesktopOverlay();
  const centered = !forceMobileSheet && isDesktop;
  const maxW = desktopMaxWidth[desktopWidth];

  return (
    <Modal
      visible={visible}
      transparent
      animationType={centered ? "fade" : "slide"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={[StyleSheet.absoluteFillObject, styles.backdrop]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
        />

        {centered ? (
          <View style={styles.desktopFrame} pointerEvents="box-none">
            <View
              style={[styles.desktopPanel, { maxWidth: maxW }, shellShadowStyle]}
              onStartShouldSetResponder={() => true}
            >
              <OverlayHeader
                title={title}
                centered
                headerAction={headerAction}
                onClose={onClose}
              />
              <OverlayBody centered>{children}</OverlayBody>
              {footer ? <OverlayFooter>{footer}</OverlayFooter> : null}
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.mobileRoot}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            pointerEvents="box-none"
          >
            <View
              style={[styles.mobilePanel, { paddingBottom: Math.max(insets.bottom, 16) }]}
              onStartShouldSetResponder={() => true}
            >
              <OverlayHeader title={title} centered={false} onClose={onClose} />
              <OverlayBody centered={false}>{children}</OverlayBody>
              {headerAction ? <OverlayFooter>{headerAction}</OverlayFooter> : null}
              {footer ? <OverlayFooter>{footer}</OverlayFooter> : null}
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </Modal>
  );
}

function OverlayHeader({
  title,
  centered,
  headerAction,
  onClose,
}: {
  title: string;
  centered: boolean;
  headerAction?: ReactNode;
  onClose: () => void;
}) {
  return (
    <View className="flex-row items-center gap-3 border-b border-border px-5 py-4">
      <SectionTitle className="min-w-0 flex-1" numberOfLines={1}>
        {title}
      </SectionTitle>
      {centered && headerAction ? <View className="shrink-0">{headerAction}</View> : null}
      {centered ? (
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          className="h-9 w-9 items-center justify-center rounded-full active:bg-surfaceMuted"
        >
          <X size={iconSizes.md} color={palette.textMuted} />
        </Pressable>
      ) : (
        <Button label="Done" variant="ghost" size="sm" onPress={onClose} />
      )}
    </View>
  );
}

function OverlayBody({
  centered,
  children,
}: {
  centered: boolean;
  children: ReactNode;
}) {
  return (
    <ScrollView
      className="px-5 pt-4"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={centered}
      style={centered ? styles.desktopScroll : styles.mobileScroll}
    >
      {children}
      <View className="h-4" />
    </ScrollView>
  );
}

function OverlayFooter({ children }: { children: ReactNode }) {
  return <View className="border-t border-border px-5 py-2.5">{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: BACKDROP,
  },
  desktopFrame: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  desktopPanel: {
    width: "100%",
    maxHeight: "85%",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  desktopScroll: {
    flexGrow: 0,
  },
  mobileRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  mobilePanel: {
    width: "100%",
    maxHeight: "88%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  mobileScroll: {
    flexGrow: 0,
  },
});
