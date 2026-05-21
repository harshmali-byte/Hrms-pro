import { Alert, Pressable, Text, View } from "react-native";
import { CalendarCheck, TrendingUp, UserPlus, Users, UserX } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { DashboardKpiCard } from "@/components/ui/DashboardKpiCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { Divider } from "@/components/ui/Divider";
import { useHrmsData } from "@/context/HrmsDataContext";

interface Props {
  onNavigatePeople?: () => void;
  onNavigateRequests?: () => void;
}

export function AdminDashboard({ onNavigatePeople, onNavigateRequests }: Props) {
  const { dashboardStats, pendingLeaveCount, dashboardCharts } = useHrmsData();
  const s = dashboardStats;
  const t = s.trends;
  const charts = dashboardCharts ?? {
    departmentEngagement: [],
    upcomingEvents: [],
    noticeBoard: [],
    attendanceTrend: { labels: [], present: [], absent: [] },
  };
  const trend = charts.attendanceTrend;

  return (
    <View>
      <HelpBanner text="Summary updates live from personnel and leave data. Use the sidebar to open each module." />

      <View className="flex-row flex-wrap gap-4">
        <DashboardKpiCard
          label="Total Employees"
          value={s.totalEmployees}
          trend={t.totalEmployees.text}
          positive={t.totalEmployees.positive}
          icon={Users}
          onPress={onNavigatePeople}
        />
        <DashboardKpiCard
          label="New Joiners"
          value={s.newJoiners}
          trend={t.newJoiners.text}
          positive={t.newJoiners.positive}
          icon={UserPlus}
        />
        <DashboardKpiCard
          label="On Leave"
          value={s.onLeave}
          trend={t.onLeave.text}
          positive={t.onLeave.positive}
          icon={UserX}
        />
        <DashboardKpiCard
          label="Active Employees"
          value={s.activeEmployees}
          trend={t.activeEmployees.text}
          positive={t.activeEmployees.positive}
          icon={TrendingUp}
          onPress={onNavigatePeople}
        />
      </View>

      {pendingLeaveCount > 0 ? (
        <Pressable
          onPress={onNavigateRequests}
          className="mt-4 rounded-lg border border-warning bg-warning-soft px-4 py-3 active:opacity-90"
        >
          <Text style={{ fontFamily: font.semibold }} className="text-sm text-warning">
            {pendingLeaveCount} leave request{pendingLeaveCount === 1 ? "" : "s"} need your approval →
          </Text>
        </Pressable>
      ) : null}

      <View className="mt-5 flex-row flex-wrap gap-4">
        <Card className="min-w-[280px] flex-1" elevated>
          <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
            Employee Engagement
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
            Department wise
          </Text>
          <View className="mt-5">
            <DonutChart segments={charts.departmentEngagement} size={150} />
          </View>
        </Card>

        <Card className="min-w-[280px] flex-1" elevated>
          <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
            Attendance Overview
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
            Present vs absent this month
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
          {charts.upcomingEvents.map((e, i) => (
            <Pressable
              key={e.id}
              onPress={() => Alert.alert(e.title, e.when)}
              className={i > 0 ? "mt-4 border-t border-border pt-4" : ""}
            >
              <Text style={{ fontFamily: font.medium }} className="text-sm text-text">
                {e.title}
              </Text>
              <Text style={{ fontFamily: font.regular }} className="mt-1 text-xs text-textMuted">
                {e.when}
              </Text>
            </Pressable>
          ))}
        </Card>

        <Card className="min-w-[280px] flex-1" elevated>
          <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
            Notice Board
          </Text>
          <Divider className="my-4" />
          {charts.noticeBoard.map((n, i) => (
            <Pressable
              key={n.id}
              onPress={() => Alert.alert(n.title, `Posted ${n.date}`)}
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
          ))}
        </Card>
      </View>
    </View>
  );
}
