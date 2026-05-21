import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { ChevronRight, Plus } from "lucide-react-native";
import {
  createDocumentTemplate,
  deleteDocumentTemplate,
  fetchDocumentTemplates,
} from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";
import type { DocumentTemplate } from "@/types/config";

export function TemplatesConfig({ onBack }: { onBack: () => void }) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchDocumentTemplates()
      .then(setTemplates)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addTemplate = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Enter a template name.");
      return;
    }
    setSaving(true);
    try {
      await createDocumentTemplate({ name: name.trim(), description, category: "other" });
      setShowAdd(false);
      setName("");
      setDescription("");
      load();
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = (t: DocumentTemplate) => {
    Alert.alert("Delete template?", t.name, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDocumentTemplate(t.id);
            load();
          } catch (e) {
            Alert.alert("Error", e instanceof ApiError ? e.message : "Delete failed");
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Templates & documents" onBack={onBack} />
      <HelpBanner text="HR document library. Tap to view; long-press delete (custom templates only)." />

      <Pressable
        onPress={() => setShowAdd(true)}
        className="mb-4 flex-row items-center justify-center rounded-xl border border-dashed border-primary bg-primary-soft py-3 active:opacity-90"
      >
        <Plus size={iconSizes.sm} color={palette.primary} />
        <Text style={{ fontFamily: font.semibold }} className="ml-2 text-sm text-primary">
          Add template
        </Text>
      </Pressable>

      <Card padded={false} elevated={false} className="overflow-hidden">
        {templates.map((t, idx) => (
          <View key={t.id}>
            <Pressable
              onPress={() =>
                Alert.alert(t.name, `${t.category.toUpperCase()} · v${t.version}\n\n${t.description ?? ""}\n\nUpdated ${t.updatedAt}`)
              }
              onLongPress={() => remove(t)}
              className="flex-row items-center px-4 py-3.5 active:bg-surfaceMuted"
            >
              <View className="flex-1">
                <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                  {t.name}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
                  {t.category} · v{t.version} · {t.updatedAt}
                </Text>
              </View>
              <ChevronRight size={iconSizes.sm} color={palette.textSubtle} />
            </Pressable>
            {idx < templates.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>

      <BottomSheet visible={showAdd} onClose={() => setShowAdd(false)} title="New template">
        <View className="gap-3">
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="Description" value={description} onChangeText={setDescription} multiline />
          <Button label="Create" fullWidth loading={saving} onPress={() => void addTemplate()} />
        </View>
      </BottomSheet>
    </ScreenContainer>
  );
}
