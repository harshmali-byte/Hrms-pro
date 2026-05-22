import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CalendarCheck, TrendingUp, UserPlus, Users, UserX } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import { ASQUARIFY_PROJECTS } from "@/constants/company";
import { Card } from "@/components/ui/Card";
import { DashboardKpiCard } from "@/components/ui/DashboardKpiCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { Divider } from "@/components/ui/Divider";
import { DashboardWidgetGrid } from "@/components/dashboard/DashboardWidgetGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmployeeListItem } from "@/components/shared/EmployeeListItem";
import { useHrmsData } from "@/context/HrmsDataContext";
import { useAdminNav } from "@/context/AdminNavContext";
import { fetchClockedInToday } from "@/api/hrmsApi";
import type { AdminRouteId } from "@/navigation/shellNav";
import type { DashboardWidget } from "@/types/dashboard";
import type { Employee } from "@/types";

type DetailSheet =
  | { kind: "event"; id: string; title: string; when: string; body: string }
  | { kind: "notice"; id: string; title: string; date: string; body: string }
  | { kind: "attendance" }
  | { kind: "kpi"; title: string; body: string; actionLabel?: string; route?: AdminRouteId }
  | { kind: "clocked-in"; loading: boolean; employees: Employee[] }
  | { kind: "projects" };

const JOINER_DAYS = 60;

function isRecentJoiner(joinedOn: string) {
  const d = new Date(joinedOn);
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - JOINER_DAYS);
  return d >= cutoff;
}

export function AdminDashboard() {
  const adminNav = useAdminNav();
  const {
    dashboardStats,
    pendingLeaveCount,
    dashboardCharts,
    dashboardWidgets,
    employees,
    leaveRequests,
    refreshAdminDashboard,
  } = useHrmsData();

  const [detail, setDetail] = useState<DetailSheet | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const s = dashboardStats;
  const t = s.trends;
  const charts = dashboardCharts ?? {
    departmentEngagement: [],
    upcomingEvents: [],
    noticeBoard: [],
    attendanceTrend: { labels: [], present: [], absent: [] },
  };
  const trend = charts.attendanceTrend;

  const newJoinersList = useMemo(
    () => employees.filter((e) => isRecentJoiner(e.joinedOn)),
    [employees],
  );

  const onLeaveList = useMemo(
    () => employees.filter((e) => e.status === "onLeave"),
    [employees],
  );

  const attendanceSummary = useMemo(() => {
    const present = trend?.present ?? [];
    const absent = trend?.absent ?? [];
    const totalPresent = present.reduce((a, b) => a + b, 0);
    const totalAbsent = absent.reduce((a, b) => a + b, 0);
    return { totalPresent, totalAbsent, labels: trend?.labels ?? [] };
  }, [trend]);

  const pullRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAdminDashboard();
    setRefreshing(false);
  }, [refreshAdminDashboard]);

  const openClockedIn = useCallback(async () => {
    setDetail({ kind: "clocked-in", loading: true, employees: [] });
    try {
      const { employees: list } = await fetchClockedInToday();
      setDetail({ kind: "clocked-in", loading: false, employees: list });
    } catch {
      setDetail({
        kind: "kpi",
        title: "Clocked in now",
        body: "Could not load live attendance. Open Personnel to see the team directory.",
        actionLabel: "Open Personnel",
        route: "people",
      });
    }
  }, []);

  const handleNavigate = useCallback(
    (target: string) => {
      const route = target as AdminRouteId;
      if (route === "people") adminNav.navigate("people");
      else if (route === "requests") adminNav.navigate("requests", { leaveTab: "pending" });
      else if (route === "payroll") adminNav.navigate("payroll");
      else if (route === "settings") adminNav.navigate("settings");
      else adminNav.navigate(route);
    },
    [adminNav],
  );

  const handleWidgetPress = useCallback(
    (w: DashboardWidget) => {
      if (w.id === "clocked-in-now") {
        void openClockedIn();
        return;
      }
      if (w.id === "next-event") {
        const e = charts.upcomingEvents[0];
        if (e) {
          setDetail({
            kind: "event",
            id: e.id,
            title: e.title,
            when: e.when,
            body: e.description ?? e.title,
          });
        }
        return;
      }
      if (w.id === "notice") {
        const n = charts.noticeBoard[0];
        if (n) {
          setDetail({
            kind: "notice",
            id: n.id,
            title: n.title,
            date: n.date,
            body: n.description ?? n.title,
          });
        }
        return;
      }
      if (w.id === "projects") {
        setDetail({ kind: "projects" });
        return;
      }
      if (w.action?.type === "navigate" && w.action.target) {
        handleNavigate(w.action.target);
      }
    },
    [charts, handleNavigate, openClockedIn],
  );

  const closeDetail = () => setDetail(null);

  return (
    <View>
      <HelpBanner text="Asquarify team overview — tap any metric, chart, or card for details. Data syncs from PostgreSQL." />

      <View className="mb-3 flex-row items-center justify-end">
        <Pressable
          onPress={() => void pullRefresh()}
          disabled={refreshing}
          className="rounded-full border border-border bg-surface px-4 py-2 active:bg-surfaceMuted"
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <Text style={{ fontFamily: font.semibold }} className="text-sm text-primary">
              Refresh dashboard
            </Text>
          )}
        </Pressable>
      </View>

      {dashboardWidgets.length > 0 ? (
        <>
          <SectionHeader title="Team overview" />
          <DashboardWidgetGrid
            widgets={dashboardWidgets}
            onAction={handleNavigate}
            onWidgetPress={handleWidgetPress}
          />
        </>
      ) : null}

      <SectionHeader title="Key metrics" />
      <View className="flex-row flex-wrap gap-4">
        <DashboardKpiCard
          label="Total Employees"
          value={s.totalEmployees}
          trend={t.totalEmployees.text}
          positive={t.totalEmployees.positive}
          icon={Users}
          onPress={() => adminNav.navigate("people")}
        />
        <DashboardKpiCard
          label="New Joiners"
          value={s.newJoiners}
          trend={t.newJoiners.text}
          positive={t.newJoiners.positive}
          icon={UserPlus}
          onPress={() =>
            setDetail({
              kind: "kpi",
              title: `New joiners (${JOINER_DAYS} days)`,
              body:
                newJoinersList.length > 0
                  ? `${newJoinersList.length} recent hire(s) joined in the last ${JOINER_DAYS} days.`
                  : "No new hires in this window.",
              actionLabel: "View all people",
              route: "people",
            })
          }
        />
        <DashboardKpiCard
          label="On Leave"
          value={s.onLeave}
          trend={t.onLeave.text}
          positive={t.onLeave.positive}
          icon={UserX}
          onPress={() =>
            adminNav.navigate("people", { peopleStatus: "onLeave" })
          }
        />
        <DashboardKpiCard
          label="Active Employees"
          value={s.activeEmployees}
          trend={t.activeEmployees.text}
          positive={t.activeEmployees.positive}
          icon={TrendingUp}
          onPress={() =>
            adminNav.navigate("people", { peopleStatus: "active" })
          }
        />
      </View>

      {pendingLeaveCount > 0 ? (
        <Pressable
          onPress={() => adminNav.navigate("requests", { leaveTab: "pending" })}
          className="mt-4 rounded-lg border border-warning bg-warning-soft px-4 py-3 active:opacity-90"
        >
          <Text style={{ fontFamily: font.semibold }} className="text-sm text-warning">
            {pendingLeaveCount} leave request{pendingLeaveCount === 1 ? "" : "s"} need your
            approval →
          </Text>
        </Pressable>
      ) : null}

      <View className="mt-5 flex-row flex-wrap gap-4">
        <Pressable
          className="min-w-[280px] flex-1 active:opacity-95"
          onPress={() =>
            setDetail({
              kind: "kpi",
              title: "Employee engagement",
              body: "Headcount split by department. Tap a department below to filter Personnel.",
              actionLabel: "Open Personnel",
              route: "people",
            })
          }
        >
          <Card className="flex-1" elevated>
            <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
              Employee Engagement
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
              Department wise · tap a row to filter
            </Text>
            <View className="mt-5">
              <DonutChart
                segments={charts.departmentEngagement}
                size={150}
                onSegmentPress={(seg) =>
                  adminNav.navigate("people", { peopleDepartment: seg.label })
                }
              />
            </View>
          </Card>
        </Pressable>

        <Pressable
          className="min-w-[280px] flex-1 active:opacity-95"
          onPress={() => setDetail({ kind: "attendance" })}
        >
          <Card className="flex-1" elevated>
            <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
              Attendance Overview
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
              Present vs absent · tap for breakdown
            </Text>
            <View className="mt-4">
              <LineChart
                series={[
                  {
                    label: "Present",
                    data: trend?.present?.length ? trend.present : [0],
                    color: palette.chartBlue,
                  },
                  {
                    label: "Absent",
                    data: trend?.absent?.length ? trend.absent : [0],
                    color: palette.chartOrange,
                  },
                ]}
                width={300}
                height={150}
              />
            </View>
          </Card>
        </Pressable>
      </View>

      <View className="mt-5 flex-row flex-wrap gap-4">
        <Card className="min-w-[280px] flex-1" elevated>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
              Upcoming Events
            </Text>
            <CalendarCheck size={18} color={palette.primary} />
          </View>
          <Divider className="my-4" />
          {charts.upcomingEvents.length === 0 ? (
            <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
              No events scheduled.
            </Text>
          ) : (
            charts.upcomingEvents.map((e, i) => (
              <Pressable
                key={e.id}
                onPress={() =>
                  setDetail({
                    kind: "event",
                    id: e.id,
                    title: e.title,
                    when: e.when,
                    body: e.description ?? e.title,
                  })
                }
                className={i > 0 ? "mt-4 border-t border-border pt-4" : ""}
              >
                <Text style={{ fontFamily: font.medium }} className="text-sm text-text">
                  {e.title}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-1 text-xs text-textMuted">
                  {e.when} · Tap for details
                </Text>
              </Pressable>
            ))
          )}
        </Card>

        <Card className="min-w-[280px] flex-1" elevated>
          <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
            Notice Board
          </Text>
          <Divider className="my-4" />
          {charts.noticeBoard.length === 0 ? (
            <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
              No notices posted.
            </Text>
          ) : (
            charts.noticeBoard.map((n, i) => (
              <Pressable
                key={n.id}
                onPress={() =>
                  setDetail({
                    kind: "notice",
                    id: n.id,
                    title: n.title,
                    date: n.date,
                    body: n.description ?? n.title,
                  })
                }
                className={`flex-row items-start justify-between ${i > 0 ? "mt-4 border-t border-border pt-4" : ""}`}
              >
                <Text
                  style={{ fontFamily: font.regular }}
                  className="mr-3 flex-1 text-sm text-text"
                  numberOfLines={2}
                >
                  {n.title}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="text-xs text-textSubtle">
                  {n.date}
                </Text>
              </Pressable>
            ))
          )}
        </Card>
      </View>

      <DetailSheets
        detail={detail}
        onClose={closeDetail}
        adminNav={adminNav}
        newJoinersList={newJoinersList}
        onLeaveList={onLeaveList}
        attendanceSummary={attendanceSummary}
        trend={trend ?? { labels: [], present: [], absent: [] }}
        leavePending={pendingLeaveCount}
        leaveTotal={leaveRequests.length}
      />
    </View>
  );
}

function DetailSheets({
  detail,
  onClose,
  adminNav,
  newJoinersList,
  onLeaveList,
  attendanceSummary,
  trend,
  leavePending,
  leaveTotal,
}: {
  detail: DetailSheet | null;
  onClose: () => void;
  adminNav: ReturnType<typeof useAdminNav>;
  newJoinersList: Employee[];
  onLeaveList: Employee[];
  attendanceSummary: { totalPresent: number; totalAbsent: number; labels: string[] };
  trend: { labels: string[]; present: number[]; absent: number[] };
  leavePending: number;
  leaveTotal: number;
}) {
  if (!detail) return null;

  if (detail.kind === "event" || detail.kind === "notice") {
    const isEvent = detail.kind === "event";
    return (
      <BottomSheet
        visible
        title={detail.title}
        onClose={onClose}
        footer={
          <Button
            label="Close"
            variant="secondary"
            fullWidth
            onPress={onClose}
          />
        }
      >
        <Badge label={isEvent ? "Event" : "Notice"} tone={isEvent ? "primary" : "warning"} />
        <Text style={{ fontFamily: font.regular }} className="mt-3 text-xs text-textSubtle">
          {isEvent ? detail.when : detail.date}
        </Text>
        <Text style={{ fontFamily: font.regular }} className="mt-4 text-base leading-6 text-text">
          {detail.body}
        </Text>
      </BottomSheet>
    );
  }

  if (detail.kind === "attendance") {
    return (
      <BottomSheet
        visible
        title="Attendance overview"
        onClose={onClose}
        footer={
          <Button
            label="View personnel"
            fullWidth
            onPress={() => {
              onClose();
              adminNav.navigate("people");
            }}
          />
        }
      >
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-textMuted">
          Last {trend.labels.length || 7} days from team clock-ins (HRMS punches).
        </Text>
        <View className="mt-4 flex-row gap-3">
          <Card className="flex-1">
            <Text style={{ fontFamily: font.bold }} className="text-2xl text-primary">
              {attendanceSummary.totalPresent}
            </Text>
            <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
              Present days
            </Text>
          </Card>
          <Card className="flex-1">
            <Text style={{ fontFamily: font.bold }} className="text-2xl text-text">
              {attendanceSummary.totalAbsent}
            </Text>
            <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
              Absent days
            </Text>
          </Card>
        </View>
        <Text style={{ fontFamily: font.semibold }} className="mt-5 text-sm text-text">
          Daily breakdown
        </Text>
        {trend.labels.map((label, i) => (
          <View key={label} className="mt-2 flex-row justify-between border-b border-border py-2">
            <Text style={{ fontFamily: font.regular }} className="text-sm text-text">
              {label}
            </Text>
            <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
              {trend.present[i] ?? 0} present · {trend.absent[i] ?? 0} absent
            </Text>
          </View>
        ))}
      </BottomSheet>
    );
  }

  if (detail.kind === "clocked-in") {
    return (
      <BottomSheet
        visible
        title="Clocked in now"
        onClose={onClose}
        footer={
          <Button
            label="Open personnel"
            fullWidth
            onPress={() => {
              onClose();
              adminNav.navigate("people");
            }}
          />
        }
      >
        {detail.loading ? (
          <ActivityIndicator color={palette.primary} className="py-8" />
        ) : detail.employees.length === 0 ? (
          <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
            No one is currently clocked in. Team members appear here after they punch in from
            Attendance.
          </Text>
        ) : (
          <View className="gap-2">
            {detail.employees.map((e) => (
              <EmployeeListItem key={e.id} employee={e} onPress={() => {}} />
            ))}
          </View>
        )}
      </BottomSheet>
    );
  }

  if (detail.kind === "projects") {
    return (
      <BottomSheet
        visible
        title="Active projects"
        onClose={onClose}
        footer={
          <Button label="Close" variant="secondary" fullWidth onPress={onClose} />
        }
      >
        {ASQUARIFY_PROJECTS.map((p) => (
          <View key={p.id} className="mb-4 rounded-xl border border-border p-4">
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                {p.name}
              </Text>
              <Badge label={p.status} tone="info" />
            </View>
            <Text style={{ fontFamily: font.regular }} className="mt-1 text-sm text-primary">
              {p.subtitle}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-2 text-sm leading-5 text-textMuted">
              {p.description}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-2 text-xs text-textSubtle">
              {p.region}
            </Text>
          </View>
        ))}
      </BottomSheet>
    );
  }

  if (detail.kind === "kpi") {
    const showJoiners = detail.title.includes("New joiners");
    const showOnLeave = detail.title.includes("On leave");
    return (
      <BottomSheet
        visible
        title={detail.title}
        onClose={onClose}
        footer={
          detail.route ? (
            <Button
              label={detail.actionLabel ?? "Continue"}
              fullWidth
              onPress={() => {
                onClose();
                if (detail.route === "people" && showOnLeave) {
                  adminNav.navigate("people", { peopleStatus: "onLeave" });
                } else if (detail.route) {
                  adminNav.navigate(detail.route);
                }
              }}
            />
          ) : (
            <Button label="Close" variant="secondary" fullWidth onPress={onClose} />
          )
        }
      >
        <Text style={{ fontFamily: font.regular }} className="text-base leading-6 text-text">
          {detail.body}
        </Text>
        {showJoiners && newJoinersList.length > 0 ? (
          <View className="mt-4 gap-2">
            {newJoinersList.map((e) => (
              <EmployeeListItem
                key={e.id}
                employee={e}
                onPress={() => {
                  onClose();
                  adminNav.navigate("people");
                }}
              />
            ))}
          </View>
        ) : null}
        {showOnLeave && onLeaveList.length > 0 ? (
          <View className="mt-4 gap-2">
            {onLeaveList.map((e) => (
              <EmployeeListItem key={e.id} employee={e} onPress={() => {}} />
            ))}
          </View>
        ) : null}
        {detail.title.includes("engagement") ? null : (
          <Text style={{ fontFamily: font.regular }} className="mt-4 text-xs text-textSubtle">
            {leavePending} pending leave · {leaveTotal} total requests
          </Text>
        )}
      </BottomSheet>
    );
  }

  return null;
}
