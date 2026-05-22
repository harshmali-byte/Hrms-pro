import { Pressable, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import {
  Activity,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Inbox,
  LogIn,
  Megaphone,
  Plane,
  Receipt,
  Sparkles,
  TrendingUp,
  UserX,
  Users,
  Wallet,
} from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import type { DashboardWidget, DashboardWidgetTone } from "@/types/dashboard";

const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  "log-in": LogIn,
  calendar: Calendar,
  plane: Plane,
  "calendar-check": CalendarCheck,
  receipt: Receipt,
  bell: Bell,
  sparkles: Sparkles,
  check: CheckCircle2,
  users: Users,
  inbox: Inbox,
  "user-x": UserX,
  "trending-up": TrendingUp,
  activity: Activity,
  wallet: Wallet,
  building: Building2,
  megaphone: Megaphone,
  briefcase: Briefcase,
};

const toneBg: Record<DashboardWidgetTone, string> = {
  default: palette.surfaceMuted,
  primary: palette.primarySoft,
  success: palette.successSoft,
  warning: palette.warningSoft,
  danger: palette.dangerSoft,
  info: palette.infoSoft,
};

const toneFg: Record<DashboardWidgetTone, string> = {
  default: palette.textMuted,
  primary: palette.primary,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
};

interface Props {
  widgets: DashboardWidget[];
  onAction?: (target: string) => void;
  onWidgetPress?: (widget: DashboardWidget) => void;
}

function WidgetCard({
  widget,
  onPress,
}: {
  widget: DashboardWidget;
  onPress?: () => void;
}) {
  const tone = widget.tone ?? "default";
  const Icon = (widget.icon && ICONS[widget.icon]) || Activity;
  const progressPct =
    widget.progress && widget.progress.total > 0
      ? Math.round((widget.progress.current / widget.progress.total) * 100)
      : 0;

  const inner = (
    <Card className="min-h-[120px] min-w-[140px] flex-1" elevated>
      <View className="flex-row items-start justify-between">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: toneBg[tone] }}
        >
          <Icon size={iconSizes.sm} color={toneFg[tone]} />
        </View>
        {widget.trend ? (
          <Text
            style={{ fontFamily: font.medium }}
            className={`text-xs ${widget.trend.positive ? "text-success" : "text-danger"}`}
          >
            {widget.trend.text}
          </Text>
        ) : null}
      </View>
      <Text style={{ fontFamily: font.bold }} className="mt-3 text-2xl tracking-tight text-text">
        {widget.value}
      </Text>
      <Text style={{ fontFamily: font.medium }} className="mt-1 text-sm text-text">
        {widget.title}
      </Text>
      {widget.subtitle ? (
        <Text
          style={{ fontFamily: font.regular }}
          className="mt-1 text-xs leading-4 text-textMuted"
          numberOfLines={2}
        >
          {widget.subtitle}
        </Text>
      ) : null}
      {widget.type === "progress" && widget.progress ? (
        <View className="mt-3">
          <View className="h-2 overflow-hidden rounded-full bg-surfaceMuted">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${progressPct}%` }}
            />
          </View>
          <Text style={{ fontFamily: font.regular }} className="mt-1 text-[10px] text-textSubtle">
            {widget.progress.current} of {widget.progress.total} steps
          </Text>
        </View>
      ) : null}
    </Card>
  );

  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} className="min-w-[140px] flex-1 active:opacity-90">
      {inner}
    </Pressable>
  );
}

export function DashboardWidgetGrid({ widgets, onAction, onWidgetPress }: Props) {
  if (!widgets.length) return null;

  return (
    <View className="mb-5 flex-row flex-wrap gap-3">
      {widgets.map((w) => {
        const nav =
          w.action?.type === "navigate" && w.action.target
            ? () => onAction?.(w.action!.target)
            : undefined;
        const onPress = onWidgetPress ? () => onWidgetPress(w) : nav;
        return <WidgetCard key={w.id} widget={w} onPress={onPress} />;
      })}
    </View>
  );
}
