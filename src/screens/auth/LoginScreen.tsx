import { useCallback, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Building2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";
import { APP, AUTH } from "@/constants/strings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";
import { API_BASE } from "@/api/config";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";
import { BodyMuted, H1, H2, Kicker, Label } from "@/components/ui/Typography";

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
  const [role, setRole] = useState<Role>("employee");
  const [email, setEmail] = useState(DEMO_EMAILS.employee);
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const selectRole = useCallback((id: Role) => {
    setRole(id);
    setEmail(DEMO_EMAILS[id]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-10 items-center">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Building2 size={iconSizes.xl} color={palette.textInverse} />
            </View>
            <H1 className="text-center">{APP.name}</H1>
            <Kicker className="mt-2 text-center">{APP.tagline}</Kicker>
          </View>

          <H2>{AUTH.welcome}</H2>
          <BodyMuted className="mt-1">{AUTH.subtitle}</BodyMuted>

          <Label className="mb-2 mt-8">{AUTH.selectRole}</Label>
          <View className="flex-row gap-3">
            {roleOptions.map(({ id, label, icon: Icon }) => {
              const active = role === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => selectRole(id)}
                  className={`flex-1 flex-row items-center justify-center rounded-xl border px-3 py-3.5 ${
                    active
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface"
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

          <View className="mt-6 gap-3">
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
                  let msg =
                    e instanceof ApiError
                      ? e.message
                      : "Cannot reach API. Start the server (see README).";
                  if (e instanceof ApiError && e.status === 401) {
                    msg += "\n\nUse demo123 and run: npm run server:seed";
                  }
                  Alert.alert("Sign in failed", msg);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Reset link",
                "Demo: password reset email would be sent to your work address.",
              )
            }
            accessibilityRole="button"
            className="mt-4 self-center py-2"
          >
            <Text style={{ fontFamily: font.semibold }} className="text-sm text-primary">
              {AUTH.forgotPassword}
            </Text>
          </Pressable>

          <Text
            style={{ fontFamily: font.regular }}
            className="mt-6 text-center text-xs leading-4 text-textSubtle"
          >
            {AUTH.demoHint}
            {"\n"}API: {API_BASE.replace("/api", "")}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
