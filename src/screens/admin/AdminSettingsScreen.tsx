import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import {
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  FileBadge,
  Globe,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react-native";
import { iconSizes, palette } from "@/constants/theme";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useHrmsData } from "@/context/HrmsDataContext";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { fetchConfigSummary } from "@/api/configApi";
import { CompanyProfileConfig } from "./config/CompanyProfileConfig";
import { LeavePoliciesConfig } from "./config/LeavePoliciesConfig";
import { RolesConfig } from "./config/RolesConfig";
import { TemplatesConfig } from "./config/TemplatesConfig";
import { NotificationsConfig } from "./config/NotificationsConfig";
import { LocaleConfig } from "./config/LocaleConfig";
import { AuditLogConfig } from "./config/AuditLogConfig";

export type ConfigPageId =
  | "hub"
  | "company"
  | "roles"
  | "leave-policies"
  | "templates"
  | "notifications"
  | "locale"
  | "audit";

const sections: {
  title: string;
  rows: { id: ConfigPageId; icon: typeof Users; label: string; hintKey?: "company" | "locale" }[];
}[] = [
  {
    title: "Organisation",
    rows: [
      { id: "company", icon: Building2, label: "Company profile", hintKey: "company" },
      { id: "roles", icon: Users, label: "Roles & permissions" },
      { id: "leave-policies", icon: ClipboardList, label: "Leave policies" },
      { id: "templates", icon: FileBadge, label: "Templates & documents" },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { id: "notifications", icon: Bell, label: "Notifications" },
      { id: "locale", icon: Globe, label: "Locale & currency", hintKey: "locale" },
      { id: "audit", icon: ShieldCheck, label: "Security & audit log" },
    ],
  },
];

function Row({
  icon: Icon,
  label,
  hint,
  destructive = false,
  onPress,
}: {
  icon: typeof Users;
  label: string;
  hint?: string;
  destructive?: boolean;
  onPress?: () => void;
}) {
  const color = destructive ? palette.danger : palette.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center px-4 py-3.5 ${onPress ? "active:bg-surfaceMuted" : ""}`}
    >
      <Icon size={iconSizes.sm} color={color} />
      <Text
        className={`ml-3 flex-1 text-base ${destructive ? "text-danger" : "text-text"}`}
      >
        {label}
      </Text>
      {hint ? <Text className="mr-2 text-sm text-textMuted">{hint}</Text> : null}
      {!destructive ? (
        <ChevronRight size={iconSizes.sm} color={palette.textSubtle} />
      ) : null}
    </Pressable>
  );
}

export function AdminSettingsScreen({ embedded = false }: { embedded?: boolean }) {
  const { signOut, user } = useAuth();
  const { resetDemoData } = useHrmsData();
  const [page, setPage] = useState<ConfigPageId>("hub");
  const [hints, setHints] = useState({ company: "Organiq Pvt. Ltd.", locale: "India · INR" });

  const loadSummary = useCallback(() => {
    fetchConfigSummary()
      .then((s) =>
        setHints({
          company: s.companyDisplayName,
          locale: s.localeLabel,
        }),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (page === "hub") loadSummary();
  }, [page, loadSummary]);

  const confirmResetDemo = () => {
    Alert.alert(
      "Reset demo data?",
      "Re-seeds the PostgreSQL database (employees, leave, payroll, and configuration).",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            void resetDemoData().then(() => loadSummary());
          },
        },
      ],
    );
  };

  if (page === "company") return <CompanyProfileConfig onBack={() => setPage("hub")} />;
  if (page === "leave-policies") return <LeavePoliciesConfig onBack={() => setPage("hub")} />;
  if (page === "roles") return <RolesConfig onBack={() => setPage("hub")} />;
  if (page === "templates") return <TemplatesConfig onBack={() => setPage("hub")} />;
  if (page === "notifications") return <NotificationsConfig onBack={() => setPage("hub")} />;
  if (page === "locale") return <LocaleConfig onBack={() => setPage("hub")} />;
  if (page === "audit") return <AuditLogConfig onBack={() => setPage("hub")} />;

  const adminName = user?.name ?? "Admin";

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Configuration" embedded={embedded} />

      <HelpBanner text="All settings are saved to PostgreSQL. Leave policies can sync employee balances." />

      <Pressable
        onPress={() => setPage("company")}
        accessibilityRole="button"
        className="active:opacity-90"
      >
        <Card>
          <View className="flex-row items-center">
            <Avatar name={adminName} color={palette.primary} size="lg" />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-text">{adminName}</Text>
              <Text className="mt-0.5 text-sm text-textMuted">
                HR Admin · {hints.company} · tap for company profile
              </Text>
            </View>
            <ChevronRight size={iconSizes.sm} color={palette.textSubtle} />
          </View>
        </Card>
      </Pressable>

      {sections.map((s) => (
        <View key={s.title}>
          <SectionHeader title={s.title} />
          <Card padded={false} elevated={false} className="overflow-hidden">
            {s.rows.map((r, idx) => (
              <View key={r.label}>
                <Row
                  icon={r.icon}
                  label={r.label}
                  hint={
                    r.hintKey === "company"
                      ? hints.company
                      : r.hintKey === "locale"
                        ? hints.locale
                        : undefined
                  }
                  onPress={() => setPage(r.id)}
                />
                {idx < s.rows.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>
        </View>
      ))}

      <View className="mt-6">
        <Card padded={false} elevated={false} className="mb-3 overflow-hidden">
          <Row icon={RotateCcw} label="Reset demo data" onPress={confirmResetDemo} />
        </Card>
        <Card padded={false} elevated={false} className="overflow-hidden">
          <Row icon={LogOut} label="Sign out" destructive onPress={() => void signOut()} />
        </Card>
      </View>
    </ScreenContainer>
  );
}
