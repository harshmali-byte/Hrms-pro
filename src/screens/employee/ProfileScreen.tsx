import { Alert, Pressable, Text, View } from "react-native";
import {
  Briefcase,
  ChevronRight,
  FileBadge,
  HelpCircle,
  IdCard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  UserCog,
} from "lucide-react-native";
import { iconSizes, palette } from "@/constants/theme";
import { font } from "@/constants/fonts";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Divider } from "@/components/ui/Divider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuth } from "@/context/AuthContext";
import { useHrmsData } from "@/context/HrmsDataContext";
import { HelpBanner } from "@/components/ui/HelpBanner";

const menu = [
  { icon: UserCog,     label: "Edit personal info" },
  { icon: FileBadge,   label: "My documents" },
  { icon: ShieldCheck, label: "Privacy & security" },
  { icon: HelpCircle,  label: "Help & support" },
];

function MenuRow({
  icon: Icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: typeof UserCog;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const color = destructive ? palette.danger : palette.text;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3.5 active:bg-surfaceMuted"
    >
      <Icon size={iconSizes.sm} color={color} />
      <Text
        className={`ml-3 flex-1 text-base ${destructive ? "text-danger" : "text-text"}`}
      >
        {label}
      </Text>
      {!destructive ? (
        <ChevronRight size={iconSizes.sm} color={palette.textSubtle} />
      ) : null}
    </Pressable>
  );
}

export function ProfileScreen({ embedded = false }: { embedded?: boolean }) {
  const { signOut } = useAuth();
  const { resetDemoData, currentEmployee } = useHrmsData();

  const emp = currentEmployee;
  const infoRows = emp
    ? [
        { icon: Mail, label: "Email", value: emp.email },
        { icon: Phone, label: "Phone", value: emp.phone },
        { icon: MapPin, label: "Location", value: emp.location ?? "—" },
        { icon: Briefcase, label: "Department", value: emp.department },
        { icon: IdCard, label: "Employee ID", value: emp.id },
      ]
    : [];

  const confirmResetDemo = () => {
    Alert.alert(
      "Reset demo data?",
      "Re-seeds the PostgreSQL database with sample employees, leave, and payroll data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            void resetDemoData();
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Profile" embedded={embedded} />

      <HelpBanner text="Profile is loaded from the API. Reset demo re-seeds the database (admin can also reset from Settings)." />

      <Card>
        <Pressable
          onPress={() =>
            emp &&
            Alert.alert(
              emp.name,
              `${emp.role}\n\nID: ${emp.id}\nDepartment: ${emp.department}\nJoined: ${emp.joinedOn}${emp.reportsTo ? `\nReports to: ${emp.reportsTo}` : ""}`,
            )
          }
          accessibilityRole="button"
          className="items-center active:opacity-90"
        >
          <Avatar
            name={emp?.name ?? "?"}
            color={emp?.avatarColor ?? "#4F6BED"}
            size="xl"
          />
          <Text style={{ fontFamily: font.semibold }} className="mt-3 text-lg text-text">
            {emp?.name ?? "—"}
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
            {emp?.role ?? ""}
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-xs text-textSubtle">
            {emp ? `Joined ${emp.joinedOn} · tap for details` : "No employee profile"}
          </Text>
        </Pressable>

        <Divider className="my-4" />

        <View className="gap-1">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <Pressable
              key={label}
              onPress={() =>
                Alert.alert(label, `${value}\n\nDemo: this field would open edit or verification in production.`)
              }
              accessibilityRole="button"
              className="flex-row items-center rounded-lg py-2.5 active:bg-surfaceMuted"
            >
              <Icon size={iconSizes.sm} color={palette.textMuted} />
              <Text style={{ fontFamily: font.regular }} className="ml-3 w-24 text-sm text-textMuted">
                {label}
              </Text>
              <Text style={{ fontFamily: font.medium }} className="flex-1 text-sm text-text">
                {value}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <SectionHeader title="Account" />
      <Card padded={false} elevated={false} className="overflow-hidden">
        {menu.map((m, idx) => (
          <View key={m.label}>
            <MenuRow
              icon={m.icon}
              label={m.label}
              onPress={() =>
                Alert.alert(m.label, "Demo: this would open the full workflow in production.")
              }
            />
            {idx < menu.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>

      <Card padded={false} elevated={false} className="mt-4 overflow-hidden">
        <MenuRow icon={RotateCcw} label="Reset demo data" onPress={confirmResetDemo} />
      </Card>

      <View className="mt-4">
        <Card padded={false} elevated={false} className="overflow-hidden">
          <MenuRow icon={LogOut} label="Sign out" destructive onPress={() => void signOut()} />
        </Card>
      </View>
    </ScreenContainer>
  );
}
