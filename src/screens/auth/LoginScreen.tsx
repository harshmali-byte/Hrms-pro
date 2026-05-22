import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";
import { breakpoints } from "@/constants/breakpoints";
import { font } from "@/constants/fonts";
import { iconSizes, palette, shellShadowStyle } from "@/constants/theme";
import { DEMO_LOGINS } from "@/constants/company";
import { AUTH } from "@/constants/strings";
import { Input } from "@/components/ui/Input";
import { LoginBrandingPanel } from "@/components/auth/LoginBrandingPanel";
import { ApiError } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

const DEMO_EMAILS: Record<Role, string> = {
  employee: DEMO_LOGINS.employee,
  admin: DEMO_LOGINS.admin,
};

const roleOptions: { id: Role; label: string; icon: typeof UserRound }[] = [
  { id: "employee", label: AUTH.employee, icon: UserRound },
  { id: "admin", label: AUTH.admin, icon: ShieldCheck },
];

function RoleCard({
  label,
  icon: Icon,
  active,
  onPress,
}: {
  label: string;
  icon: typeof UserRound;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`relative min-h-[88px] flex-1 items-center justify-center rounded-2xl border-2 px-3 py-4 ${
        active ? "border-primary bg-primary-soft" : "border-border bg-surface"
      }`}
      style={active ? { shadowColor: palette.primary, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } } : shellShadowStyle}
    >
      {active ? (
        <View className="absolute right-2 top-2 h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Check size={12} color="#fff" strokeWidth={3} />
        </View>
      ) : null}
      <Icon size={iconSizes.lg} color={active ? palette.primary : palette.textMuted} />
      <Text
        style={{ fontFamily: font.semibold }}
        className={`mt-2 text-sm ${active ? "text-primary" : "text-text"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SocialButton({ label, accent }: { label: string; accent: string }) {
  return (
    <Pressable
      onPress={() => Alert.alert(label, "Demo: SSO would open the provider sign-in flow.")}
      className="min-h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface active:bg-surfaceMuted"
    >
      <View
        className="h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: accent }}
      >
        <Text style={{ fontFamily: font.bold }} className="text-xs text-white">
          {label[0]}
        </Text>
      </View>
      <Text style={{ fontFamily: font.medium }} className="text-sm text-text">
        {label}
      </Text>
    </Pressable>
  );
}

function LoginForm() {
  const { signIn } = useAuth();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState(DEMO_EMAILS.admin);
  const [password, setPassword] = useState<string>(DEMO_LOGINS.password);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const selectRole = useCallback((id: Role) => {
    setRole(id);
    setEmail(DEMO_EMAILS[id]);
  }, []);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Enter work email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      let msg =
        e instanceof ApiError
          ? e.message
          : "Cannot reach API. Start the server (see README).";
      if (e instanceof ApiError && e.status === 401) {
        msg +=
          "\n\nUse password demo123. If this is a new install, run:\nnpm run server:reset\n(or npm run server:sync-users)";
      }
      Alert.alert("Sign in failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full max-w-[440px] self-center">
      <View className="mb-8 flex-row items-center justify-end">
        <Pressable
          onPress={() => Alert.alert("Language", "Demo: language picker (English, Hindi, …).")}
          className="flex-row items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 active:bg-surfaceMuted"
        >
          <Globe size={16} color={palette.textMuted} />
          <Text style={{ fontFamily: font.medium }} className="text-sm text-text">
            English
          </Text>
          <ChevronDown size={14} color={palette.textSubtle} />
        </Pressable>
      </View>

      <Text style={{ fontFamily: font.bold }} className="text-[28px] leading-9 text-text">
        {AUTH.welcomeBack}
      </Text>
      <Text
        style={{ fontFamily: font.regular }}
        className="mt-2 text-base leading-6 text-textMuted"
      >
        {AUTH.welcomeSub}
      </Text>

      <Text style={{ fontFamily: font.semibold }} className="mb-3 mt-8 text-sm text-text">
        {AUTH.selectRole}
      </Text>
      <View className="flex-row gap-3">
        {roleOptions.map((opt) => (
          <RoleCard
            key={opt.id}
            {...opt}
            active={role === opt.id}
            onPress={() => selectRole(opt.id)}
          />
        ))}
      </View>

      <View className="mt-6 gap-4">
        <Input
          label={AUTH.email}
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label={AUTH.password}
          icon={Lock}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          allowPasswordToggle
          autoComplete="password"
        />
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => setRememberMe((v) => !v)}
          className="flex-row items-center gap-2"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}
        >
          <View
            className={`h-5 w-5 items-center justify-center rounded border-2 ${
              rememberMe ? "border-primary bg-primary" : "border-border bg-surface"
            }`}
          >
            {rememberMe ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
          </View>
          <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
            {AUTH.rememberMe}
          </Text>
        </Pressable>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Reset link",
              "Demo: password reset email would be sent to your work address.",
            )
          }
        >
          <Text style={{ fontFamily: font.semibold }} className="text-sm text-primary">
            {AUTH.forgotPassword}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => void handleSignIn()}
        disabled={loading}
        className={`mt-6 min-h-[52px] flex-row items-center justify-center rounded-xl bg-primary active:opacity-90 ${
          loading ? "opacity-70" : ""
        }`}
        style={{
          shadowColor: palette.primary,
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={{ fontFamily: font.semibold }} className="text-base text-white">
              {AUTH.signIn}
            </Text>
            <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
          </>
        )}
      </Pressable>

      <View className="my-6 flex-row items-center">
        <View className="h-px flex-1 bg-border" />
        <Text
          style={{ fontFamily: font.regular }}
          className="mx-4 text-xs text-textSubtle"
        >
          {AUTH.orContinueWith}
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className="flex-row gap-3">
        <SocialButton label="Google" accent="#EA4335" />
        <SocialButton label="Microsoft" accent="#2563EB" />
      </View>

      <Text
        style={{ fontFamily: font.regular }}
        className="mt-8 text-center text-xs text-textSubtle"
      >
        {AUTH.appVersion}
      </Text>
    </View>
  );
}

export function LoginScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= breakpoints.lg;

  if (wide) {
    return (
      <SafeAreaView className="min-h-full flex-1 flex-row bg-primary">
        <View className="min-h-full flex-1" style={{ width: "58%", minWidth: 480, maxWidth: 720 }}>
          <LoginBrandingPanel />
        </View>
        <View
          className="flex-1 justify-center bg-surface px-12 py-10"
          style={{
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
            ...shellShadowStyle,
          }}
        >
          <LoginForm />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LoginBrandingPanel compact />
          <View className="flex-1 px-5 pb-8 pt-6">
            <LoginForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
