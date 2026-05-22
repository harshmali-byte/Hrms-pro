import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, Switch, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import {
  Briefcase,
  ChevronRight,
  Eye,
  FileBadge,
  HelpCircle,
  IdCard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react-native";
import {
  createDocument,
  createSupportTicket,
  deleteDocument,
  deleteSupportTicket,
  fetchAccountOverview,
  updateAccountSettings,
  updateDocument,
  updateMyProfile,
  updatePrivacy,
  updateSupportTicket,
} from "@/api/accountApi";
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
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type {
  AccountOverview,
  AccountSettings,
  Employee,
  EmployeeDocument,
  EmployeeDocumentCategory,
  PrivacyPreferences,
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types";

type Section = "profile" | "documents" | "privacy" | "support" | "settings" | null;

const documentCategories: EmployeeDocumentCategory[] = [
  "identity",
  "employment",
  "payroll",
  "education",
  "other",
];
const priorities: SupportTicketPriority[] = ["low", "medium", "high"];
const statuses: SupportTicketStatus[] = ["open", "in_progress", "resolved", "closed"];

const emptyPrivacy: PrivacyPreferences = {
  profileVisibility: "team",
  shareBirthday: true,
  sharePhone: false,
  twoFactorEnabled: false,
};

const emptySettings: AccountSettings = {
  language: "English",
  timezone: "Asia/Kolkata",
  emailNotifications: true,
  pushNotifications: true,
  compactMode: false,
};

const emptyDoc = {
  id: "",
  title: "",
  category: "identity" as EmployeeDocumentCategory,
  fileUrl: "",
  notes: "",
};

const emptyTicket = {
  id: "",
  subject: "",
  message: "",
  priority: "medium" as SupportTicketPriority,
  status: "open" as SupportTicketStatus,
};

const menu: { key: Exclude<Section, null>; icon: LucideIcon; label: string }[] = [
  { key: "profile", icon: UserCog, label: "Edit profile" },
  { key: "documents", icon: FileBadge, label: "My documents" },
  { key: "privacy", icon: ShieldCheck, label: "Privacy & security" },
  { key: "support", icon: HelpCircle, label: "Help & support" },
  { key: "settings", icon: Settings, label: "Settings" },
];

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function MenuRow({
  icon: Icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: LucideIcon;
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
        style={{ fontFamily: font.medium }}
        className={`ml-3 flex-1 text-base ${destructive ? "text-danger" : "text-text"}`}
      >
        {label}
      </Text>
      {!destructive ? <ChevronRight size={iconSizes.sm} color={palette.textSubtle} /> : null}
    </Pressable>
  );
}

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <View>
      <Text style={{ fontFamily: font.semibold }} className="mb-2 text-sm text-text">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              className={`rounded-full border px-3 py-2 ${
                selected ? "border-primary bg-primary-soft" : "border-border bg-surface"
              }`}
            >
              <Text
                style={{ fontFamily: font.semibold }}
                className={`text-xs ${selected ? "text-primary" : "text-textMuted"}`}
              >
                {titleCase(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      <Text style={{ fontFamily: font.medium }} className="text-sm text-text">
        {label}
      </Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export function ProfileScreen({ embedded = false }: { embedded?: boolean }) {
  const { signOut } = useAuth();
  const { resetDemoData, currentEmployee, reload } = useHrmsData();
  const [section, setSection] = useState<Section>(null);
  const [overview, setOverview] = useState<AccountOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    location: "",
    reportsTo: "",
  });
  const [privacyForm, setPrivacyForm] = useState(emptyPrivacy);
  const [settingsForm, setSettingsForm] = useState(emptySettings);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [docForm, setDocForm] = useState(emptyDoc);
  const [ticketForm, setTicketForm] = useState(emptyTicket);

  const emp = overview?.employee ?? currentEmployee;
  const documents = overview?.documents ?? [];
  const tickets = overview?.supportTickets ?? [];

  const loadAccount = async () => {
    setLoading(true);
    try {
      const data = await fetchAccountOverview();
      setOverview(data);
      setProfileForm({
        name: data.employee.name,
        phone: data.employee.phone,
        location: data.employee.location ?? "",
        reportsTo: data.employee.reportsTo ?? "",
      });
      setPrivacyForm(data.privacy);
      setSettingsForm(data.settings);
    } catch (e) {
      Alert.alert("Account unavailable", e instanceof Error ? e.message : "Could not load account data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccount();
  }, []);

  const refreshAccount = async () => {
    const data = await fetchAccountOverview();
    setOverview(data);
    await reload();
  };

  const openSection = (next: Exclude<Section, null>) => {
    setSection(next);
    if (next === "documents") setDocForm(emptyDoc);
    if (next === "support") setTicketForm(emptyTicket);
  };

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
            void resetDemoData().then(loadAccount);
          },
        },
      ],
    );
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateMyProfile(profileForm);
      await refreshAccount();
      Alert.alert("Saved", "Profile details updated.");
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const saveDocument = async () => {
    if (!docForm.title.trim()) {
      Alert.alert("Missing title", "Add a document title before saving.");
      return;
    }
    setSaving(true);
    try {
      if (docForm.id) {
        await updateDocument(docForm.id, docForm);
      } else {
        await createDocument(docForm);
      }
      await refreshAccount();
      setDocForm(emptyDoc);
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Document save failed.");
    } finally {
      setSaving(false);
    }
  };

  const removeDocument = (doc: EmployeeDocument) => {
    Alert.alert("Delete document?", doc.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void deleteDocument(doc.id).then(refreshAccount);
        },
      },
    ]);
  };

  const previewDocument = async (doc: EmployeeDocument) => {
    if (doc.fileUrl.trim()) {
      try {
        await Linking.openURL(doc.fileUrl.trim());
        return;
      } catch {
        Alert.alert("Preview unavailable", "Could not open this document link.");
        return;
      }
    }

    Alert.alert(
      doc.title,
      [
        `Category: ${titleCase(doc.category)}`,
        doc.notes ? `Notes: ${doc.notes}` : "No file URL or notes added.",
      ].join("\n"),
    );
  };

  const savePrivacy = async () => {
    setSaving(true);
    try {
      await updatePrivacy({ ...privacyForm, ...passwordForm });
      await refreshAccount();
      setPasswordForm({ currentPassword: "", newPassword: "" });
      Alert.alert("Saved", "Privacy and security preferences updated.");
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Privacy update failed.");
    } finally {
      setSaving(false);
    }
  };

  const saveTicket = async () => {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      Alert.alert("Missing details", "Add a subject and message before saving.");
      return;
    }
    setSaving(true);
    try {
      if (ticketForm.id) {
        await updateSupportTicket(ticketForm.id, ticketForm);
      } else {
        await createSupportTicket(ticketForm);
      }
      await refreshAccount();
      setTicketForm(emptyTicket);
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Support ticket save failed.");
    } finally {
      setSaving(false);
    }
  };

  const removeTicket = (ticket: SupportTicket) => {
    Alert.alert("Delete ticket?", ticket.subject, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void deleteSupportTicket(ticket.id).then(refreshAccount);
        },
      },
    ]);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateAccountSettings(settingsForm);
      await refreshAccount();
      Alert.alert("Saved", "Account settings updated.");
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Settings update failed.");
    } finally {
      setSaving(false);
    }
  };

  const infoRows = emp
    ? [
        { icon: Mail, label: "Email", value: emp.email },
        { icon: Phone, label: "Phone", value: emp.phone },
        { icon: MapPin, label: "Location", value: emp.location ?? "-" },
        { icon: Briefcase, label: "Department", value: emp.department },
        { icon: IdCard, label: "Employee ID", value: emp.id },
      ]
    : [];

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Profile" embedded={embedded} />

      <HelpBanner text="Manage your account details, documents, security, help tickets, and preferences." />

      <Card>
        <Pressable
          onPress={() => emp && openSection("profile")}
          accessibilityRole="button"
          className="items-center active:opacity-90"
        >
          <Avatar name={emp?.name ?? "?"} color={emp?.avatarColor ?? "#0066FF"} size="xl" />
          <Text style={{ fontFamily: font.semibold }} className="mt-3 text-lg text-text">
            {emp?.name ?? "-"}
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
            {emp?.role ?? ""}
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-xs text-textSubtle">
            {emp ? `Joined ${emp.joinedOn} - tap to edit` : "No employee profile"}
          </Text>
        </Pressable>

        <Divider className="my-4" />

        <View className="gap-1">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <View key={label} className="flex-row items-center rounded-lg py-2.5">
              <Icon size={iconSizes.sm} color={palette.textMuted} />
              <Text style={{ fontFamily: font.regular }} className="ml-3 w-24 text-sm text-textMuted">
                {label}
              </Text>
              <Text style={{ fontFamily: font.medium }} className="flex-1 text-sm text-text">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader title="Account" actionLabel={loading ? "Loading" : undefined} />
      <Card padded={false} elevated={false} className="overflow-hidden">
        {menu.map((m, idx) => (
          <View key={m.key}>
            <MenuRow icon={m.icon} label={m.label} onPress={() => openSection(m.key)} />
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

      <BottomSheet
        visible={section === "profile"}
        title="Edit profile"
        onClose={() => setSection(null)}
        footer={<Button label="Save profile" icon={Save} loading={saving} onPress={saveProfile} fullWidth />}
      >
        <View className="gap-3">
          <Input label="Full name" value={profileForm.name} onChangeText={(name) => setProfileForm((f) => ({ ...f, name }))} />
          <Input label="Phone" value={profileForm.phone} onChangeText={(phone) => setProfileForm((f) => ({ ...f, phone }))} keyboardType="phone-pad" />
          <Input label="Location" value={profileForm.location} onChangeText={(location) => setProfileForm((f) => ({ ...f, location }))} />
          <Input label="Reports to" value={profileForm.reportsTo} onChangeText={(reportsTo) => setProfileForm((f) => ({ ...f, reportsTo }))} />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={section === "documents"}
        title="My documents"
        onClose={() => setSection(null)}
        footer={<Button label={docForm.id ? "Update document" : "Add document"} icon={Plus} loading={saving} onPress={saveDocument} fullWidth />}
      >
        <View className="gap-3">
          <Input label="Document title" value={docForm.title} onChangeText={(title) => setDocForm((f) => ({ ...f, title }))} />
          <OptionRow label="Category" value={docForm.category} options={documentCategories} onChange={(category) => setDocForm((f) => ({ ...f, category }))} />
          <Input label="File URL" value={docForm.fileUrl} onChangeText={(fileUrl) => setDocForm((f) => ({ ...f, fileUrl }))} autoCapitalize="none" />
          <Input label="Notes" value={docForm.notes} onChangeText={(notes) => setDocForm((f) => ({ ...f, notes }))} multiline />

          <Divider className="my-1" />
          {documents.length === 0 ? (
            <Text className="text-sm text-textMuted">No documents added yet.</Text>
          ) : (
            documents.map((doc) => (
              <View key={doc.id} className="rounded-xl border border-border bg-surface p-3">
                <View className="flex-row items-start">
                  <View className="flex-1">
                    <Text style={{ fontFamily: font.semibold }} className="text-sm text-text">{doc.title}</Text>
                    <View className="mt-2">
                      <Badge label={titleCase(doc.category)} tone="info" />
                    </View>
                    {doc.notes ? <Text className="mt-2 text-xs text-textMuted">{doc.notes}</Text> : null}
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => void previewDocument(doc)}
                      accessibilityRole="button"
                      accessibilityLabel={`Preview ${doc.title}`}
                      className="h-9 w-9 items-center justify-center rounded-full border border-border bg-surface active:bg-surfaceMuted"
                    >
                      <Eye size={iconSizes.sm} color={palette.primary} />
                    </Pressable>
                    <Button label="Edit" size="sm" variant="secondary" onPress={() => setDocForm({ ...doc })} />
                  </View>
                </View>
                <View className="mt-3">
                  <Button label="Delete" size="sm" variant="danger" icon={Trash2} onPress={() => removeDocument(doc)} />
                </View>
              </View>
            ))
          )}
        </View>
      </BottomSheet>

      <BottomSheet
        visible={section === "privacy"}
        title="Privacy & security"
        onClose={() => setSection(null)}
        footer={<Button label="Save security" icon={Save} loading={saving} onPress={savePrivacy} fullWidth />}
      >
        <View className="gap-3">
          <OptionRow
            label="Profile visibility"
            value={privacyForm.profileVisibility}
            options={["team", "managers", "private"]}
            onChange={(profileVisibility) => setPrivacyForm((f) => ({ ...f, profileVisibility }))}
          />
          <ToggleRow label="Share birthday with team" value={privacyForm.shareBirthday} onChange={(shareBirthday) => setPrivacyForm((f) => ({ ...f, shareBirthday }))} />
          <ToggleRow label="Share phone number internally" value={privacyForm.sharePhone} onChange={(sharePhone) => setPrivacyForm((f) => ({ ...f, sharePhone }))} />
          <ToggleRow label="Two-factor authentication" value={privacyForm.twoFactorEnabled} onChange={(twoFactorEnabled) => setPrivacyForm((f) => ({ ...f, twoFactorEnabled }))} />
          <Input label="Current password" value={passwordForm.currentPassword} onChangeText={(currentPassword) => setPasswordForm((f) => ({ ...f, currentPassword }))} secureTextEntry />
          <Input label="New password" value={passwordForm.newPassword} onChangeText={(newPassword) => setPasswordForm((f) => ({ ...f, newPassword }))} secureTextEntry />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={section === "support"}
        title="Help & support"
        onClose={() => setSection(null)}
        footer={<Button label={ticketForm.id ? "Update ticket" : "Create ticket"} icon={Plus} loading={saving} onPress={saveTicket} fullWidth />}
      >
        <View className="gap-3">
          <Input label="Subject" value={ticketForm.subject} onChangeText={(subject) => setTicketForm((f) => ({ ...f, subject }))} />
          <Input label="Message" value={ticketForm.message} onChangeText={(message) => setTicketForm((f) => ({ ...f, message }))} multiline />
          <OptionRow label="Priority" value={ticketForm.priority} options={priorities} onChange={(priority) => setTicketForm((f) => ({ ...f, priority }))} />
          {ticketForm.id ? (
            <OptionRow label="Status" value={ticketForm.status} options={statuses} onChange={(status) => setTicketForm((f) => ({ ...f, status }))} />
          ) : null}

          <Divider className="my-1" />
          {tickets.length === 0 ? (
            <Text className="text-sm text-textMuted">No support tickets yet.</Text>
          ) : (
            tickets.map((ticket) => (
              <View key={ticket.id} className="rounded-xl border border-border bg-surface p-3">
                <View className="flex-row items-start">
                  <View className="flex-1">
                    <Text style={{ fontFamily: font.semibold }} className="text-sm text-text">{ticket.subject}</Text>
                    <Text className="mt-1 text-xs text-textMuted">{ticket.message}</Text>
                    <View className="mt-2 flex-row gap-2">
                      <Badge label={titleCase(ticket.priority)} tone="warning" />
                      <Badge label={titleCase(ticket.status)} tone={ticket.status === "resolved" ? "success" : "info"} />
                    </View>
                  </View>
                  <Button label="Edit" size="sm" variant="secondary" onPress={() => setTicketForm({ ...ticket })} />
                </View>
                <View className="mt-3">
                  <Button label="Delete" size="sm" variant="danger" icon={Trash2} onPress={() => removeTicket(ticket)} />
                </View>
              </View>
            ))
          )}
        </View>
      </BottomSheet>

      <BottomSheet
        visible={section === "settings"}
        title="Settings"
        onClose={() => setSection(null)}
        footer={<Button label="Save settings" icon={Save} loading={saving} onPress={saveSettings} fullWidth />}
      >
        <View className="gap-3">
          <Input label="Language" value={settingsForm.language} onChangeText={(language) => setSettingsForm((f) => ({ ...f, language }))} />
          <Input label="Timezone" value={settingsForm.timezone} onChangeText={(timezone) => setSettingsForm((f) => ({ ...f, timezone }))} />
          <ToggleRow label="Email notifications" value={settingsForm.emailNotifications} onChange={(emailNotifications) => setSettingsForm((f) => ({ ...f, emailNotifications }))} />
          <ToggleRow label="Push notifications" value={settingsForm.pushNotifications} onChange={(pushNotifications) => setSettingsForm((f) => ({ ...f, pushNotifications }))} />
          <ToggleRow label="Compact mode" value={settingsForm.compactMode} onChange={(compactMode) => setSettingsForm((f) => ({ ...f, compactMode }))} />
        </View>
      </BottomSheet>
    </ScreenContainer>
  );
}
