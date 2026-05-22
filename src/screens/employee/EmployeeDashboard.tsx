import { useCallback, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import {
  Bell,
  CalendarDays,
  FileText,
  Plane,
  Receipt,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react-native";
import { iconSizes, palette } from "@/constants/theme";
import type { Announcement } from "@/types";
import type { EmployeeRouteId } from "@/navigation/shellNav";
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
import { font } from "@/constants/fonts";
import { Divider } from "@/components/ui/Divider";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { Headline, Kicker, LinkLabel } from "@/components/ui/Typography";
import { DashboardWidgetGrid } from "@/components/dashboard/DashboardWidgetGrid";
import { useHrmsData } from "@/context/HrmsDataContext";
import { COMMON } from "@/constants/strings";

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

export function EmployeeDashboard({
  embedded = false,
  onNavigate,
}: {
  embedded?: boolean;
  onNavigate?: (route: EmployeeRouteId) => void;
}) {
  const { employees, currentEmployee, announcements, holidays, dashboardWidgets } =
    useHrmsData();
  const nextHoliday = holidays[0];
  const [sheet, setSheet] = useState<"holidays" | "directory" | "announcement" | null>(
    null,
  );
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const openAnnouncement = useCallback((a: Announcement) => {
    setSelectedAnnouncement(a);
    setSheet("announcement");
  }, []);

  const onQuickAction = useCallback(
    (key: QuickKey) => {
      switch (key) {
        case "leave":
          onNavigate?.("leave");
          break;
        case "payslip":
          onNavigate?.("payslip");
          break;
        case "holidays":
          setSheet("holidays");
          break;
        case "reimburse":
          Alert.alert(
            "Reimbursements",
            "Demo: your draft expense report was saved. Approvals route to Finance.",
          );
          break;
        case "directory":
          setSheet("directory");
          break;
        case "health":
          Alert.alert("Health benefits", "Demo: open policy PDF and network hospitals (mock).");
          break;
        case "documents":
          Alert.alert("Documents", "Demo: tax forms and offer letter available in vault.");
          break;
        case "announcements":
          setSheet("announcement");
          setSelectedAnnouncement(announcements[0]!);
          break;
        default:
          break;
      }
    },
    [onNavigate],
  );

  return (
    <ScreenContainer embedded={embedded}>
      <View className="mb-2">
        <Kicker>Welcome back</Kicker>
        <Headline>
          {(currentEmployee?.name ?? "there").split(" ")[0]}
        </Headline>
      </View>

      <HelpBanner text="Asquarify builds Ne Family (UK insurance) and Bakali (fresh mangoes) — clock in, track Hubstaff, and ship on time from Junagadh." />

      {dashboardWidgets.length > 0 ? (
        <>
          <SectionHeader title="Your overview" />
          <DashboardWidgetGrid
            widgets={dashboardWidgets}
            onAction={(target) => onNavigate?.(target as EmployeeRouteId)}
          />
        </>
      ) : null}

      <View className={embedded ? "" : "mt-2"}>
        <AttendanceWidget />
      </View>

      <ProjectsShowcase />

      <SectionHeader
        title="Quick actions"
        actionLabel={COMMON.viewAll}
        onAction={() =>
          Alert.alert(
            "Shortcuts",
            "Use tiles below for Leave, Payslips, Holidays, Directory, and more. Open Attendance from the bottom tab for full history.",
          )
        }
      />
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

      <SectionHeader
        title="Upcoming holiday"
        actionLabel="See all"
        onAction={() => setSheet("holidays")}
      />
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
          <Pressable
            key={h.id}
            onPress={() =>
              Alert.alert(
                h.name,
                `${h.date}\nType: ${h.type === "public" ? "Public holiday" : "Optional holiday"}\n\nDemo: add to device calendar would be offered here.`,
              )
            }
            accessibilityRole="button"
            className="mb-3 rounded-lg active:bg-surfaceMuted"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium text-text">{h.name}</Text>
              <Badge label={h.type === "public" ? "Public" : "Optional"} tone="neutral" />
            </View>
            <Text className="mt-1 text-sm text-textMuted">{h.date}</Text>
            {i < holidays.length - 1 ? <Divider className="mt-3" /> : null}
          </Pressable>
        ))}
      </BottomSheet>

      <BottomSheet visible={sheet === "directory"} title="People directory" onClose={() => setSheet(null)}>
        {employees.map((e) => (
          <Pressable
            key={e.id}
            onPress={() =>
              Alert.alert(
                e.name,
                `${e.role}\n${e.department}\n${e.email}\n${e.phone}\nJoined: ${e.joinedOn}`,
              )
            }
            accessibilityRole="button"
            className="mb-4 flex-row items-center rounded-xl active:bg-surfaceMuted"
          >
            <Avatar name={e.name} color={e.avatarColor} size="sm" />
            <View className="ml-3 flex-1">
              <Text className="text-base font-medium text-text">{e.name}</Text>
              <Text className="text-sm text-textMuted">
                {e.role} · {e.department}
              </Text>
              <Text className="text-xs text-textSubtle">{e.email} · tap for details</Text>
            </View>
          </Pressable>
        ))}
      </BottomSheet>

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
              <Text className="text-xs text-textMuted">{selectedAnnouncement.postedOn}</Text>
            </View>
            <Text className="text-sm leading-6 text-text">{selectedAnnouncement.body}</Text>
            <Text className="mt-4 text-xs text-textSubtle">— {selectedAnnouncement.postedBy}</Text>
            <Divider className="my-5" />
          </>
        ) : null}
        {announcements.map((a) => (
          <Pressable
            key={a.id}
            className="mb-3 rounded-lg border border-border p-3 active:bg-surfaceMuted"
            onPress={() => setSelectedAnnouncement(a)}
          >
            <Text className="font-semibold text-text">{a.title}</Text>
            <Text className="mt-1 text-sm text-textMuted" numberOfLines={2}>
              {a.body}
            </Text>
          </Pressable>
        ))}
      </BottomSheet>
    </ScreenContainer>
  );
}
