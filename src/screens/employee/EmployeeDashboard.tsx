import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Share,
  Text,
  View,
} from "react-native";
import {
  Bell,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  Plane,
  Receipt,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react-native";
import { iconSizes, palette } from "@/constants/theme";
import { font } from "@/constants/fonts";
import type { Announcement } from "@/types";
import type { Employee } from "@/types";
import type { DashboardWidget } from "@/types/dashboard";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ActionTile } from "@/components/shared/ActionTile";
import { AttendanceWidget } from "@/components/shared/AttendanceWidget";
import { ProjectsShowcase } from "@/components/shared/ProjectsShowcase";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DialogActions } from "@/components/ui/FormActions";
import { Divider } from "@/components/ui/Divider";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { Headline, Kicker, LinkLabel } from "@/components/ui/Typography";
import { DashboardWidgetGrid } from "@/components/dashboard/DashboardWidgetGrid";
import { NotificationDetailModal } from "@/components/layout/NotificationDetailModal";
import { useEmployeeNav } from "@/context/EmployeeNavContext";
import { useHrmsData } from "@/context/HrmsDataContext";
import type { HrmsNotification } from "@/types";
import type { EmployeeRouteId } from "@/navigation/shellNav";
type SheetKind = "holidays" | "directory" | "announcement" | "health" | "reimburse" | "notifications" | null;

type QuickKey =
  | "leave"
  | "payslip"
  | "holidays"
  | "reimburse"
  | "directory"
  | "health"
  | "documents"
  | "announcements";

const quickActions: {
  key: QuickKey;
  label: string;
  icon: typeof Plane;
  accent: string;
}[] = [
  { key: "leave", label: "Apply leave", icon: Plane, accent: palette.primary },
  { key: "payslip", label: "Payslips", icon: Receipt, accent: palette.accent },
  { key: "holidays", label: "Holidays", icon: CalendarDays, accent: "#10B981" },
  { key: "reimburse", label: "Reimburse", icon: Wallet, accent: "#F59E0B" },
  { key: "directory", label: "Directory", icon: Users, accent: "#8B5CF6" },
  { key: "health", label: "Health", icon: Stethoscope, accent: "#EF4444" },
  { key: "documents", label: "Documents", icon: FileText, accent: palette.accent },
  { key: "announcements", label: "Announcements", icon: Bell, accent: "#64748B" },
];

export function EmployeeDashboard({ embedded = false }: { embedded?: boolean }) {
  const nav = useEmployeeNav();
  const {
    employees,
    currentEmployee,
    announcements,
    holidays,
    dashboardWidgets,
    notifications,
    employeeTemplates,
    markNotificationRead,
    markAllNotificationsRead,
    reload,
  } = useHrmsData();

  const nextHoliday = holidays[0];
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<HrmsNotification | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const healthPolicy = useMemo(
    () => employeeTemplates.find((t) => t.category === "policy" && /health|remote|hubstaff/i.test(t.name)),
    [employeeTemplates],
  );

  const openAnnouncement = useCallback((a: Announcement) => {
    setSelectedAnnouncement(a);
    setSheet("announcement");
  }, []);

  const handleNavigate = useCallback(
    (target: string) => {
      nav.navigate(target as EmployeeRouteId);
    },
    [nav],
  );

  const handleWidgetPress = useCallback(
    (w: DashboardWidget) => {
      if (w.id === "notifications") {
        setSheet("notifications");
        return;
      }
      if (w.action?.type === "navigate" && w.action.target) {
        handleNavigate(w.action.target);
      }
    },
    [handleNavigate],
  );

  const onQuickAction = useCallback(
    (key: QuickKey) => {
      switch (key) {
        case "leave":
          nav.navigate("leave");
          break;
        case "payslip":
          nav.navigate("payslip");
          break;
        case "holidays":
          setSheet("holidays");
          break;
        case "reimburse":
          setSheet("reimburse");
          break;
        case "directory":
          setSheet("directory");
          break;
        case "health":
          setSheet("health");
          break;
        case "documents":
          nav.navigate("profile", { profileSection: "documents" });
          break;
        case "announcements":
          setSelectedAnnouncement(null);
          setSheet("announcement");
          break;
        default:
          break;
      }
    },
    [nav, announcements],
  );

  const pullRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const contactEmployee = (e: Employee, channel: "email" | "phone") => {
    const url = channel === "email" ? `mailto:${e.email}` : `tel:${e.phone.replace(/\s/g, "")}`;
    Linking.openURL(url).catch(() => {
      void Share.share({ message: channel === "email" ? e.email : e.phone });
    });
  };

  return (
    <ScreenContainer embedded={embedded}>
      <View className="mb-2 flex-row items-start justify-between">
        <View className="flex-1">
          <Kicker>Welcome back</Kicker>
          <Headline>{(currentEmployee?.name ?? "there").split(" ")[0]}</Headline>
        </View>
        <Pressable
          onPress={() => void pullRefresh()}
          className="rounded-full border border-border bg-surface px-3 py-2 active:bg-surfaceMuted"
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <Text style={{ fontFamily: font.semibold }} className="text-xs text-primary">
              Refresh
            </Text>
          )}
        </Pressable>
      </View>

      <HelpBanner text="Clock in for HRMS attendance, keep Hubstaff running on your machine, and use shortcuts below for leave, payslips, and team directory." />

      {dashboardWidgets.length > 0 ? (
        <>
          <SectionHeader title="Your overview" />
          <DashboardWidgetGrid
            widgets={dashboardWidgets}
            onAction={handleNavigate}
            onWidgetPress={handleWidgetPress}
          />
        </>
      ) : null}

      <View className={embedded ? "" : "mt-2"}>
        <AttendanceWidget />
      </View>

      <ProjectsShowcase />

      <SectionHeader title="Quick actions" actionLabel="Attendance" onAction={() => nav.navigate("attendance")} />
      <View className="flex-row flex-wrap gap-2">
        {quickActions.map((a) => (
          <ActionTile
            key={a.key}
            label={a.label}
            icon={a.icon}
            accent={a.accent}
            onPress={() => onQuickAction(a.key)}
          />
        ))}
      </View>

      <SectionHeader title="Upcoming holiday" actionLabel="See all" onAction={() => setSheet("holidays")} />
      {nextHoliday ? (
        <Pressable onPress={() => setSheet("holidays")} accessibilityRole="button">
          <Card className="active:bg-surfaceMuted" elevated={false}>
            <View className="flex-row items-center">
              <View
                className="h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: palette.primarySoft }}
              >
                <CalendarDays size={iconSizes.md} color={palette.primary} />
              </View>
              <View className="ml-3 flex-1">
                <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                  {nextHoliday.name}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
                  {nextHoliday.date} · {nextHoliday.type === "public" ? "Public" : "Optional"}
                </Text>
              </View>
              <LinkLabel>All →</LinkLabel>
            </View>
          </Card>
        </Pressable>
      ) : null}

      <SectionHeader
        title="Announcements"
        actionLabel="See all"
        onAction={() => {
          setSelectedAnnouncement(null);
          setSheet("announcement");
        }}
      />
      <View className="gap-3">
        {announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} onPress={() => openAnnouncement(a)} />
        ))}
      </View>

      <BottomSheet visible={sheet === "holidays"} title="Holiday calendar" onClose={() => setSheet(null)}>
        {holidays.map((h, i) => (
          <View key={h.id} className={i > 0 ? "mt-4 border-t border-border pt-4" : ""}>
            <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
              {h.name}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-1 text-sm text-textMuted">
              {h.date}
            </Text>
            <Badge
              label={h.type === "public" ? "Public holiday" : "Optional holiday"}
              tone="neutral"
            />
          </View>
        ))}
      </BottomSheet>

      <BottomSheet
        visible={sheet === "directory"}
        title="People directory"
        onClose={() => {
          setSheet(null);
          setSelectedEmployee(null);
        }}
      >
        {employees.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => setSelectedEmployee(e)}
            className="mb-3 flex-row items-center rounded-xl border border-border p-3 active:bg-surfaceMuted"
          >
            <Avatar name={e.name} color={e.avatarColor} size="sm" />
            <View className="ml-3 flex-1">
              <Text style={{ fontFamily: font.semibold }} className="text-sm text-text">
                {e.name}
              </Text>
              <Text style={{ fontFamily: font.regular }} className="text-xs text-textMuted">
                {e.role} · {e.department}
              </Text>
            </View>
          </Pressable>
        ))}
        {selectedEmployee ? (
          <>
            <Divider className="my-4" />
            <Text style={{ fontFamily: font.bold }} className="text-lg text-text">
              {selectedEmployee.name}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-2 text-sm text-textMuted">
              {selectedEmployee.role} · {selectedEmployee.department}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-1 text-sm text-text">
              {selectedEmployee.email}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="text-sm text-text">
              {selectedEmployee.phone}
            </Text>
            <View className="mt-4">
              <DialogActions>
                <Button
                  label="Email"
                  icon={Mail}
                  variant="secondary"
                  size="sm"
                  onPress={() => contactEmployee(selectedEmployee, "email")}
                />
                <Button
                  label="Call"
                  icon={Phone}
                  variant="secondary"
                  size="sm"
                  onPress={() => contactEmployee(selectedEmployee, "phone")}
                />
              </DialogActions>
            </View>
          </>
        ) : null}
      </BottomSheet>

      <BottomSheet
        visible={sheet === "health"}
        title="Health & benefits"
        onClose={() => setSheet(null)}
        footer={
          <DialogActions>
            <Button
              label="Open documents"
              size="sm"
              onPress={() => {
                setSheet(null);
                nav.navigate("profile", { profileSection: "documents" });
              }}
            />
          </DialogActions>
        }
      >
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
          {healthPolicy?.description ??
            "Group health cover and wellness benefits are managed by HR. Contact support for enrolment changes."}
        </Text>
        {healthPolicy ? (
          <Text style={{ fontFamily: font.regular }} className="mt-3 text-xs text-textSubtle">
            Policy: {healthPolicy.name} · v{healthPolicy.version}
          </Text>
        ) : null}
      </BottomSheet>

      <BottomSheet
        visible={sheet === "reimburse"}
        title="Reimbursements"
        onClose={() => setSheet(null)}
        footer={
          <DialogActions>
            <Button
              label="Open support"
              size="sm"
              onPress={() => {
                setSheet(null);
                nav.navigate("profile", { profileSection: "support" });
              }}
            />
          </DialogActions>
        }
      >
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
          Submit expenses through Help & support on your profile. Finance approves against project codes
          (Ne Family, Bakali, internal).
        </Text>
      </BottomSheet>

      <BottomSheet
        visible={sheet === "notifications"}
        title="Notifications"
        onClose={() => setSheet(null)}
        footer={
          notifications.some((n) => !n.read) ? (
            <Pressable onPress={markAllNotificationsRead} className="py-2">
              <Text style={{ fontFamily: font.semibold }} className="text-center text-sm text-primary">
                Mark all as read
              </Text>
            </Pressable>
          ) : undefined
        }
      >
        {notifications.length === 0 ? (
          <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
            No notifications yet.
          </Text>
        ) : (
          notifications.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => {
                if (!n.read) markNotificationRead(n.id);
                setSelectedNotification(n);
              }}
              className="mb-3 rounded-xl border border-border p-3 active:bg-surfaceMuted"
            >
              <Text style={{ fontFamily: font.semibold }} className="text-sm text-text">
                {n.title}
              </Text>
              <Text style={{ fontFamily: font.regular }} className="mt-1 text-xs text-textMuted" numberOfLines={2}>
                {n.body}
              </Text>
            </Pressable>
          ))
        )}
      </BottomSheet>

      <NotificationDetailModal
        notification={selectedNotification}
        visible={selectedNotification != null}
        onClose={() => setSelectedNotification(null)}
      />

      <BottomSheet
        visible={sheet === "announcement"}
        title={selectedAnnouncement ? selectedAnnouncement.title : "Announcements"}
        onClose={() => {
          setSheet(null);
          setSelectedAnnouncement(null);
        }}
      >
        {selectedAnnouncement ? (
          <>
            <View className="mb-2 flex-row items-center justify-between">
              <Badge label={selectedAnnouncement.tag} tone="info" />
              <Text style={{ fontFamily: font.regular }} className="text-xs text-textMuted">
                {selectedAnnouncement.postedOn}
              </Text>
            </View>
            <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
              {selectedAnnouncement.body}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-4 text-xs text-textSubtle">
              — {selectedAnnouncement.postedBy}
            </Text>
            <Divider className="my-5" />
          </>
        ) : null}
        {announcements.map((a) => (
          <Pressable
            key={a.id}
            className="mb-3 rounded-lg border border-border p-3 active:bg-surfaceMuted"
            onPress={() => setSelectedAnnouncement(a)}
          >
            <Text style={{ fontFamily: font.semibold }} className="text-text">
              {a.title}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-1 text-sm text-textMuted" numberOfLines={2}>
              {a.body}
            </Text>
          </Pressable>
        ))}
      </BottomSheet>
    </ScreenContainer>
  );
}
