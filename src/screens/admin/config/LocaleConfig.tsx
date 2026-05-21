import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { fetchOrgPreferences, updateOrgPreferences } from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import type { OrgPreferences } from "@/types/config";

export function LocaleConfig({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState<OrgPreferences | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrgPreferences()
      .then(setPrefs)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  const set = (key: keyof OrgPreferences, value: string) => {
    setPrefs((p) => (p ? { ...p, [key]: value } : p));
  };

  const save = async () => {
    if (!prefs) return;
    setSaving(true);
    try {
      const updated = await updateOrgPreferences(prefs);
      setPrefs(updated);
      Alert.alert("Saved", `Locale set to ${updated.country} · ${updated.currency}`);
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!prefs) return null;

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Locale & currency" onBack={onBack} />
      <HelpBanner text="Regional settings for dates, currency on payslips, and payroll exports." />
      <View className="gap-3">
        <Input label="Country" value={prefs.country} onChangeText={(v) => set("country", v)} />
        <Input label="Currency code" value={prefs.currency} onChangeText={(v) => set("currency", v)} />
        <Input label="Locale" value={prefs.locale} onChangeText={(v) => set("locale", v)} />
        <Input label="Timezone" value={prefs.timezone} onChangeText={(v) => set("timezone", v)} />
        <Button label="Save" fullWidth loading={saving} onPress={() => void save()} />
      </View>
    </ScreenContainer>
  );
}
