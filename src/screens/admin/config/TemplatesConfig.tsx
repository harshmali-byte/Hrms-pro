import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Eye, Plus } from "lucide-react-native";
import {
  createDocumentTemplate,
  deleteDocumentTemplate,
  fetchDocumentTemplates,
  updateDocumentTemplate,
} from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormActions } from "@/components/ui/FormActions";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";
import type { DocumentTemplate } from "@/types/config";

const templateCategories: DocumentTemplate["category"][] = [
  "offer",
  "policy",
  "letter",
  "form",
  "other",
];

export function TemplatesConfig({ onBack }: { onBack: () => void }) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [edit, setEdit] = useState<DocumentTemplate | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DocumentTemplate["category"]>("other");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchDocumentTemplates()
      .then(setTemplates)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEdit(null);
    setName("");
    setCategory("other");
    setDescription("");
    setVersion("1.0");
  };

  const openCreate = () => {
    resetForm();
    setShowEditor(true);
  };

  const openEdit = (template: DocumentTemplate) => {
    setEdit(template);
    setName(template.name);
    setCategory(template.category);
    setDescription(template.description ?? "");
    setVersion(template.version);
    setShowEditor(true);
  };

  const saveTemplate = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Enter a template name.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        description: description.trim(),
        version: version.trim() || "1.0",
      };
      if (edit) {
        await updateDocumentTemplate(edit.id, payload);
      } else {
        await createDocumentTemplate(payload);
      }
      setShowEditor(false);
      resetForm();
      load();
      Alert.alert("Saved", edit ? "Template updated." : "Template created.");
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Save failed");
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

  const previewTemplate = (template: DocumentTemplate) => {
    Alert.alert(
      template.name,
      [
        `Category: ${template.category.toUpperCase()}`,
        `Version: ${template.version}`,
        `Updated: ${template.updatedAt}`,
        "",
        template.description?.trim() || "No preview content has been added yet.",
      ].join("\n"),
    );
  };

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Templates & documents" onBack={onBack} />
      <HelpBanner text="HR document library. Tap to edit; long-press delete." />

      <Pressable
        onPress={openCreate}
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
            <View className="flex-row items-center px-4 py-3.5">
              <Pressable
                onPress={() => openEdit(t)}
                onLongPress={() => remove(t)}
                className="flex-1 active:opacity-80"
              >
                <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                  {t.name}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
                  {t.category} - v{t.version} - {t.updatedAt}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => previewTemplate(t)}
                accessibilityRole="button"
                accessibilityLabel={`Preview ${t.name}`}
                className="ml-3 h-9 w-9 items-center justify-center rounded-full border border-border bg-surface active:bg-surfaceMuted"
              >
                <Eye size={iconSizes.sm} color={palette.primary} />
              </Pressable>
            </View>
            {idx < templates.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>

      <BottomSheet
        visible={showEditor}
        onClose={() => {
          setShowEditor(false);
          resetForm();
        }}
        title={edit ? "Edit template" : "New template"}
        desktopWidth="lg"
        footer={
          <FormActions
            primaryLabel={edit ? "Save template" : "Create template"}
            onPrimary={() => void saveTemplate()}
            primaryLoading={saving}
            onSecondary={() => {
              setShowEditor(false);
              resetForm();
            }}
          />
        }
      >
        <View className="gap-3">
          <Input label="Name" value={name} onChangeText={setName} />
          <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">
            Category
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {templateCategories.map((c) => {
              const active = c === category;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  className={`rounded-full border px-3 py-2 ${
                    active ? "border-primary bg-primary-soft" : "border-border bg-surface"
                  }`}
                >
                  <Text className={`text-sm font-medium ${active ? "text-primary" : "text-text"}`}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Input label="Version" value={version} onChangeText={setVersion} />
          <Input label="Description" value={description} onChangeText={setDescription} multiline />
        </View>
      </BottomSheet>
    </ScreenContainer>
  );
}
