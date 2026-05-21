import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Building2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";
import { APP, AUTH } from "@/constants/strings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/api/client";
import { API_BASE } from "@/api/config";
import { useAuth } from "@/context/AuthContext";
import { useResponsive } from "@/hooks/useResponsive";
import type { Role } from "@/types";
import { BodyMuted, H1, H2, Kicker } from "@/components/ui/Typography";

const DEMO_EMAILS: Record<Role, string> = {
  employee: "aarav.mehta@organiq.co",
  admin: "admin@organiq.co",
};

const roleOptions: { id: Role; label: string; icon: typeof UserRound }[] = [
  { id: "employee", label: AUTH.employee, icon: UserRound },
  { id: "admin", label: AUTH.admin, icon: ShieldCheck },
];

export function LoginScreen() {
  const { signIn } = useAuth();
  const { isDesktop } = useResponsive();
  const [role, setRole] = useState<Role>("employee");
  const [email, setEmail] = useState(DEMO_EMAILS.employee);
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const selectRole = useCallback((id: Role) => {
    setRole(id);
    setEmail(DEMO_EMAILS[id]);
  }, []);

  const form = (
    <Card className="w-full max-w-login border-0 md:border md:shadow-card" elevated>
      <H2>{AUTH.welcome}</H2>
      <BodyMuted className="mt-1">{AUTH.subtitle}</BodyMuted>

      <Text style={{ fontFamily: font.semibold }} className="mb-2 mt-6 text-sm text-text">
        {AUTH.selectRole}
      </Text>
      <View className="flex-row gap-3">
        {roleOptions.map(({ id, label, icon: Icon }) => {
          const active = role === id;
          return (
            <Pressable
              key={id}
              onPress={() => selectRole(id)}
              className={`flex-1 flex-row items-center justify-center rounded-xl border px-3 py-3 ${
                active
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-background"
              }`}
            >
              <Icon
                size={iconSizes.sm}
                color={active ? palette.primary : palette.textMuted}
              />
              <Text
                style={{ fontFamily: font.semibold }}
                className={`ml-2 text-sm ${active ? "text-primary" : "text-text"}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-5 gap-3">
        <Input
          label={AUTH.email}
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label={AUTH.password}
          icon={Lock}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View className="mt-8">
        <Button
          label={AUTH.signIn}
          fullWidth
          loading={loading}
          onPress={async () => {
            if (!email.trim() || !password.trim()) {
              Alert.alert("Missing fields", "Enter work email and password.");
              return;
            }
            setLoading(true);
            try {
              await signIn(email, password);
            } catch (e) {
              const msg =
                e instanceof ApiError
                  ? e.message
                  : "Cannot reach API. Start the server (see README).";
              if (e instanceof ApiError && e.status === 401) {
                Alert.alert("Sign in failed", `${msg}\n\nUse demo123 and run: npm run server:seed`);
              } else {
                Alert.alert("Sign in failed", msg);
              }
            } finally {
              setLoading(false);
            }
          }}
        />
      </View>

      <Text
        style={{ fontFamily: font.regular }}
        className="mt-6 text-center text-xs leading-5 text-textSubtle"
      >
        {AUTH.demoHint}
        {"\n"}
        API: {API_BASE.replace("/api", "")}
      </Text>
    </Card>
  );

  if (isDesktop && Platform.OS === "web") {
    return (
      <View className="min-h-full flex-1 flex-row bg-background">
        <View className="hidden w-[42%] max-w-[520px] flex-col justify-between bg-primary p-12 lg:flex">
          <View>
            <View className="mb-8 h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Building2 size={28} color={palette.textInverse} />
            </View>
            <Text style={{ fontFamily: font.bold }} className="text-3xl leading-tight text-textInverse">
              {APP.name}
            </Text>
            <Text
              style={{ fontFamily: font.regular }}
              className="mt-3 max-w-sm text-base leading-6 text-white/85"
            >
              {APP.tagline}. Manage people, leave, attendance, and payroll in one clear workspace.
            </Text>
          </View>
          <Text style={{ fontFamily: font.regular }} className="text-sm text-white/70">
            Web-first · Responsive · PostgreSQL backend
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6 py-12">
          <View className="mb-8 items-center lg:hidden">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Building2 size={iconSizes.xl} color={palette.textInverse} />
            </View>
            <H1>{APP.name}</H1>
            <Kicker className="mt-2">{APP.tagline}</Kicker>
          </View>
          {form}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center px-5 py-8">
          <View className="mb-8 items-center">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Building2 size={iconSizes.xl} color={palette.textInverse} />
            </View>
            <H1 className="text-center">{APP.name}</H1>
            <Kicker className="mt-2 text-center">{APP.tagline}</Kicker>
          </View>
          {form}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
