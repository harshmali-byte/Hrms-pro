import { useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Building2,
  CalendarCheck,
  LineChart,
  Plane,
  Receipt,
  Users,
  Wallet,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ASQUARIFY } from "@/constants/company";
import { font } from "@/constants/fonts";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";

const FEATURES: { label: string; icon: LucideIcon }[] = [
  { label: "People", icon: Users },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Leave", icon: Plane },
  { label: "Payroll", icon: Wallet },
  { label: "Performance", icon: LineChart },
];

const SPLASH_MS = 4200;
const FEATURE_CYCLE_MS = 650;

interface Props {
  onComplete: () => void;
}

function GradientBackdrop() {
  const { width, height } = useWindowDimensions();
  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Defs>
        <LinearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0B1220" />
          <Stop offset="45%" stopColor="#0F172A" />
          <Stop offset="100%" stopColor="#0C1A3D" />
        </LinearGradient>
        <LinearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={palette.primary} stopOpacity="0.35" />
          <Stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#bg)" />
      <Rect width="100%" height="55%" fill="url(#glow)" />
    </Svg>
  );
}

export function PostLoginSplashScreen({ onComplete }: Props) {
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const [featureIndex, setFeatureIndex] = useState(0);
  const progress = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.4);
  const trackWidth = Math.max(240, screenWidth - 48);

  const roleLabel = user?.role === "admin" ? "Admin workspace" : "Employee workspace";
  const firstName = user?.name?.split(" ")[0] ?? "there";

  useEffect(() => {
    progress.value = withTiming(1, { duration: SPLASH_MS, easing: Easing.out(Easing.cubic) });
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1200 }),
        withTiming(0.35, { duration: 1200 }),
      ),
      -1,
      false,
    );

    const featureInterval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % FEATURES.length);
    }, FEATURE_CYCLE_MS);

    const timer = setTimeout(onComplete, SPLASH_MS);

    return () => {
      clearInterval(featureInterval);
      clearTimeout(timer);
    };
  }, [onComplete, logoScale, progress, ringOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: 1 + ringOpacity.value * 0.15 }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: trackWidth * progress.value,
  }));

  const current = FEATURES[featureIndex]!;
  const FeatureIcon = current.icon;

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <GradientBackdrop />

      <View
        pointerEvents="none"
        className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-primary/20"
        style={{ transform: [{ scale: 1.2 }] }}
      />
      <View
        pointerEvents="none"
        className="absolute -right-10 bottom-40 h-44 w-44 rounded-full bg-blue-500/10"
      />

      <SafeAreaView className="flex-1 items-center justify-center px-6" edges={["top", "bottom"]}>
        <Animated.View entering={FadeIn.duration(700)} style={logoStyle} className="items-center">
          <Animated.View
            style={[
              ringStyle,
              {
                position: "absolute",
                width: 108,
                height: 108,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: palette.primary,
              },
            ]}
          />
          <View
            className="h-20 w-20 items-center justify-center rounded-3xl"
            style={{
              backgroundColor: palette.primary,
              shadowColor: palette.primary,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.45,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <Building2 size={38} color="#fff" />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          className="mt-8 items-center"
        >
          <Text
            style={{ fontFamily: font.bold, letterSpacing: 1.2 }}
            className="text-4xl text-white"
          >
            {ASQUARIFY.displayName}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <View className="h-px w-8 bg-blue-500/50" />
            <Text style={{ fontFamily: font.semibold }} className="text-xl text-blue-400">
              PeopleOS
            </Text>
            <View className="h-px w-8 bg-blue-500/50" />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(900).duration(600)}
          className="mt-5 max-w-xs"
        >
          <Text
            style={{ fontFamily: font.regular }}
            className="text-center text-base leading-6 text-slate-400"
          >
            The operating system for modern workforces
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(1300).duration(500)}
          className="mt-6 rounded-full border border-white/10 bg-white/5 px-4 py-2"
        >
          <Text style={{ fontFamily: font.medium }} className="text-sm text-slate-300">
            Welcome back, {firstName} · {roleLabel}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(1700).duration(500)}
          className="mt-10 min-h-[88px] items-center"
        >
          <Animated.View
            key={featureIndex}
            entering={FadeIn.duration(280)}
            exiting={FadeOut.duration(200)}
            className="flex-row items-center gap-3 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-5 py-3"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/30">
              <FeatureIcon size={22} color="#93C5FD" />
            </View>
            <View>
              <Text style={{ fontFamily: font.regular }} className="text-xs uppercase text-slate-500">
                Powering
              </Text>
              <Text style={{ fontFamily: font.semibold }} className="text-lg text-blue-200">
                {current.label}
              </Text>
            </View>
          </Animated.View>

          <View className="mt-5 flex-row flex-wrap justify-center gap-2">
            {FEATURES.map((f, i) => {
              const active = i === featureIndex;
              return (
                <View
                  key={f.label}
                  className={`rounded-full px-3 py-1 ${active ? "bg-primary" : "bg-white/5"}`}
                >
                  <Text
                    style={{ fontFamily: font.medium }}
                    className={`text-xs ${active ? "text-white" : "text-slate-500"}`}
                  >
                    {f.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(2200).duration(500)}
          className="absolute bottom-12 left-6 right-6"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <Text style={{ fontFamily: font.regular }} className="text-xs text-slate-500">
              Loading your workspace…
            </Text>
            <Receipt size={14} color="#64748B" />
          </View>
          <View className="h-1 overflow-hidden rounded-full bg-white/10">
            <Animated.View
              style={[barStyle, { height: 4, borderRadius: 999, backgroundColor: palette.primary }]}
            />
          </View>
          <Text
            style={{ fontFamily: font.regular }}
            className="mt-4 text-center text-sm text-slate-500"
          >
            Manage people. Simplify work.
          </Text>
          <Text
            style={{ fontFamily: font.regular }}
            className="mt-1 text-center text-[11px] text-slate-600"
          >
            {ASQUARIFY.headquarters}
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
