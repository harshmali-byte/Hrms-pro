import { Text, View, useWindowDimensions } from "react-native";
import {
  Building2,
  CalendarCheck,
  IndianRupee,
  Shield,
  TrendingUp,
  Users,
  Plane,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ASQUARIFY } from "@/constants/company";
import { AUTH } from "@/constants/strings";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";

const FEATURES: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "People Management",
    desc: "Centralize employee data and organization structure in one place.",
    icon: Users,
  },
  {
    title: "Attendance Tracking",
    desc: "Smart attendance with real-time insights and analytics.",
    icon: CalendarCheck,
  },
  {
    title: "Leave Management",
    desc: "Seamless leave requests, approvals and balance tracking.",
    icon: Plane,
  },
  {
    title: "Payroll Automation",
    desc: "Automated payroll processing with accuracy and compliance.",
    icon: IndianRupee,
  },
];

const TRUST = [
  { label: "Secure & Compliant", sub: "Enterprise grade security", icon: Shield },
  { label: "99.9% Uptime", sub: "Reliable & Always On", icon: TrendingUp },
  { label: "500+ Companies", sub: "Trust Us Worldwide", icon: Building2 },
];

function BrandGradient() {
  const { width, height } = useWindowDimensions();
  const w = Math.max(width * 0.6, 400);
  return (
    <Svg width={w} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id="brandBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#003D99" />
          <Stop offset="50%" stopColor="#0052CC" />
          <Stop offset="100%" stopColor="#0066FF" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#brandBg)" />
      <Circle cx={w * 0.85} cy={height * 0.15} r={120} fill="#FFFFFF" opacity={0.06} />
      <Circle cx={w * 0.2} cy={height * 0.7} r={90} fill="#FFFFFF" opacity={0.05} />
      <Circle cx={w * 0.65} cy={height * 0.55} r={60} fill="#60A5FA" opacity={0.12} />
    </Svg>
  );
}

function DashboardIllustration() {
  return (
    <View className="relative h-[200px] w-[220px] shrink-0">
      <View
        className="absolute right-0 top-4 h-[170px] w-[190px] rounded-2xl border border-white/20 p-3"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      >
        <View className="mb-3 flex-row gap-2">
          {[0.6, 0.85, 0.45, 0.7].map((h, i) => (
            <View
              key={i}
              className="flex-1 rounded-md bg-white/30"
              style={{ height: 48 * h }}
            />
          ))}
        </View>
        <View className="flex-row gap-2">
          <View className="h-8 w-8 rounded-full bg-blue-300/50" />
          <View className="flex-1 justify-center gap-1">
            <View className="h-2 w-full rounded bg-white/25" />
            <View className="h-2 w-3/4 rounded bg-white/15" />
          </View>
        </View>
        <View className="mt-3 flex-row gap-2">
          <View className="h-6 flex-1 rounded-md bg-white/20" />
          <View className="h-6 flex-1 rounded-md bg-white/15" />
        </View>
      </View>
      <View className="absolute bottom-6 left-0 h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/20">
        <Users size={20} color="#fff" />
      </View>
      <View className="absolute left-8 top-0 h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
        <Users size={18} color="#fff" />
      </View>
    </View>
  );
}

interface Props {
  compact?: boolean;
}

export function LoginBrandingPanel({ compact = false }: Props) {
  return (
    <View
      className={`relative overflow-hidden bg-primary ${compact ? "px-5 py-8" : "min-h-full flex-1 px-10 py-10"}`}
    >
      <BrandGradient />

      <View className="relative z-10 flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-white">
          <Text style={{ fontFamily: font.bold }} className="text-xl text-primary">
            A
          </Text>
        </View>
        <View>
          <Text style={{ fontFamily: font.bold }} className="text-lg text-white">
            {ASQUARIFY.displayName}
          </Text>
          <Text style={{ fontFamily: font.semibold }} className="text-sm text-blue-200">
            PeopleOS
          </Text>
        </View>
      </View>

      <Text
        style={{ fontFamily: font.bold }}
        className={`relative z-10 text-white ${compact ? "mt-6 text-2xl leading-9" : "mt-10 max-w-md text-[32px] leading-[40px]"}`}
      >
        The Operating System For Modern Workforces
      </Text>
      <Text
        style={{ fontFamily: font.regular }}
        className={`relative z-10 text-blue-100 ${compact ? "mt-3 text-sm leading-5" : "mt-4 max-w-lg text-base leading-6"}`}
      >
        All your people operations in one intelligent platform. Simplify processes. Empower
        people.
      </Text>

      {!compact ? (
        <View className="relative z-10 mt-10 flex-row items-start justify-between gap-6">
          <View className="max-w-md flex-1 gap-5">
            {FEATURES.map(({ title, desc, icon: Icon }) => (
              <View key={title} className="flex-row gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Icon size={iconSizes.md} color="#fff" />
                </View>
                <View className="min-w-0 flex-1">
                  <Text style={{ fontFamily: font.semibold }} className="text-sm text-white">
                    {title}
                  </Text>
                  <Text
                    style={{ fontFamily: font.regular }}
                    className="mt-0.5 text-xs leading-4 text-blue-100/90"
                  >
                    {desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <DashboardIllustration />
        </View>
      ) : (
        <View className="relative z-10 mt-4 flex-row flex-wrap gap-2">
          {FEATURES.map(({ title, icon: Icon }) => (
            <View
              key={title}
              className="flex-row items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"
            >
              <Icon size={14} color="#fff" />
              <Text style={{ fontFamily: font.medium }} className="text-xs text-white">
                {title.split(" ")[0]}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View
        className={`relative z-10 ${compact ? "mt-6" : "mt-auto pt-10"} flex-row flex-wrap gap-4`}
      >
        {TRUST.map(({ label, sub, icon: Icon }) => (
          <View key={label} className={compact ? "min-w-[45%] flex-1" : "mr-6"}>
            <View className="flex-row items-center gap-2">
              <Icon size={16} color="#93C5FD" />
              <Text style={{ fontFamily: font.semibold }} className="text-xs text-white">
                {label}
              </Text>
            </View>
            <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-[10px] text-blue-200/80">
              {sub}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{ fontFamily: font.regular }}
        className={`relative z-10 text-[11px] text-blue-200/70 ${compact ? "mt-4" : "mt-6"}`}
      >
        {AUTH.poweredBy}
      </Text>
    </View>
  );
}
