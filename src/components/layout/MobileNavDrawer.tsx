import { Modal, Pressable, View } from "react-native";
import { layout, palette } from "@/constants/theme";
import { Sidebar } from "./Sidebar";
import type { ShellNavItem } from "@/navigation/shellNav";

interface Props {
  visible: boolean;
  onClose: () => void;
  items: ShellNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  userName: string;
  userRole: string;
  avatarColor: string;
  onSignOut: () => void;
}

export function MobileNavDrawer({
  visible,
  onClose,
  items,
  activeId,
  onNavigate,
  userName,
  userRole,
  avatarColor,
  onSignOut,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable
        className="flex-1 flex-row"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }}
        onPress={onClose}
      >
        <Pressable
          className="h-full shadow-lg"
          style={{ width: layout.sidebarDrawerWidth, backgroundColor: palette.surface }}
          onPress={(e) => e.stopPropagation()}
        >
          <Sidebar
            items={items}
            activeId={activeId}
            onNavigate={(id) => {
              onNavigate(id);
              onClose();
            }}
            userName={userName}
            userRole={userRole}
            avatarColor={avatarColor}
            onSignOut={() => {
              onSignOut();
              onClose();
            }}
            variant="drawer"
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
