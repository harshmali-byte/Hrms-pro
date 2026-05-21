import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { fetchOrgPreferences, updateOrgPreferences } from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import { font } from "@/constants/fonts";
import type { OrgPreferences } from "@/types/config";

const toggles: { key: keyof OrgPreferences; label: string }[] = [
  { key: "emailNotifications", label: "Email notifications" },
  { key: "pushNotifications", label: "Push notifications" },
  { key: "leaveReminders", label: "Leave reminders" },
  { key: "payrollAlerts", label: "Payroll alerts" },
  { key: "policyUpdates", label: "Policy & document updates" },
];

export function NotificationsConfig({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState<OrgPreferences | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrgPreferences()
      .then(setPrefs)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  const setBool = (key: keyof OrgPreferences, value: boolean) => {
    setPrefs((p) => (p ? { ...p, [key]: value } : p));
  };

  const save = async () => {
    if (!prefs) return;
    setSaving(true);
    try {
      const updated = await updateOrgPreferences(prefs);
      setPrefs(updated);
      Alert.alert("Saved", "Notification preferences updated.");
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!prefs) return null;

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Notifications" onBack={onBack} />
      <HelpBanner text="Organisation-wide notification channels. Changes apply to all users." />
      <Card>
        {toggles.map((t) => (
          <View
            key={t.key}
            className="flex-row items-center justify-between border-b border-border py-3 last:border-b-0"
          >
            <Text style={{ fontFamily: font.medium }} className="text-text">
              {t.label}
            </Text>
            <Switch
              value={Boolean(prefs[t.key])}
              onValueChange={(v) => setBool(t.key, v)}
            />
          </View>
        ))}
      </Card>
      <View className="mt-4">
        <Button label="Save preferences" fullWidth loading={saving} onPress={() => void save()} />
      </View>
    </ScreenContainer>
  );
}
