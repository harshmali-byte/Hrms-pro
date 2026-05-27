import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { fetchCompanyProfile, updateCompanyProfile } from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import type { CompanyProfile } from "@/types/config";

export function CompanyProfileConfig({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState<CompanyProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanyProfile()
      .then(setForm)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  const set = (key: keyof CompanyProfile, value: string) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const updated = await updateCompanyProfile(form);
      setForm(updated);
      Alert.alert("Saved", "Company profile updated.");
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return null;

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Company profile" onBack={onBack} />
      <HelpBanner text="Legal and branding details used on payslips, letters, and employee-facing pages." />
      <View className="gap-3">
        <Input label="Display name" value={form.displayName} onChangeText={(v) => set("displayName", v)} />
        <Input label="Legal name" value={form.legalName} onChangeText={(v) => set("legalName", v)} />
        <Input label="Address" value={form.address} onChangeText={(v) => set("address", v)} multiline />
        <Input label="Country" value={form.country} onChangeText={(v) => set("country", v)} />
        <Input label="Industry" value={form.industry} onChangeText={(v) => set("industry", v)} />
        <Input
          label="Website"
          value={form.website ?? ""}
          onChangeText={(v) => set("website", v)}
          autoCapitalize="none"
        />
        <Input label="Tax ID / GSTIN" value={form.taxId ?? ""} onChangeText={(v) => set("taxId", v)} />
        <View className="mt-4 flex-row justify-end">
          <Button label="Save changes" size="sm" loading={saving} onPress={() => void save()} />
        </View>
      </View>
    </ScreenContainer>
  );
}
