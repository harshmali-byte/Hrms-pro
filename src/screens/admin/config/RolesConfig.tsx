import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { fetchHrRoles, fetchPermissions, updateHrRole } from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { FormActions } from "@/components/ui/FormActions";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";
import type { HrRole, PermissionItem } from "@/types/config";

export function RolesConfig({ onBack }: { onBack: () => void }) {
  const [roles, setRoles] = useState<HrRole[]>([]);
  const [catalog, setCatalog] = useState<PermissionItem[]>([]);
  const [edit, setEdit] = useState<HrRole | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    Promise.all([fetchHrRoles(), fetchPermissions()])
      .then(([r, p]) => {
        setRoles(r);
        setCatalog(p);
      })
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePerm = (key: string) => {
    if (!edit) return;
    const has = edit.permissions.includes(key);
    setEdit({
      ...edit,
      permissions: has
        ? edit.permissions.filter((k) => k !== key)
        : [...edit.permissions, key],
    });
  };

  const save = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      await updateHrRole(edit.id, { permissions: edit.permissions });
      setEdit(null);
      load();
      Alert.alert("Saved", `${edit.name} permissions updated.`);
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const groups = [...new Set(catalog.map((p) => p.group))];

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Roles & permissions" onBack={onBack} />
      <HelpBanner text="Control what each role can do in HRMS. System roles cannot be deleted." />

      <Card padded={false} elevated={false} className="overflow-hidden">
        {roles.map((r, idx) => (
          <View key={r.id}>
            <Pressable
              onPress={() => setEdit({ ...r })}
              className="flex-row items-center px-4 py-3.5 active:bg-surfaceMuted"
            >
              <View className="flex-1">
                <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                  {r.name}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
                  {r.permissions.length} permissions · {r.slug}
                </Text>
              </View>
              <ChevronRight size={iconSizes.sm} color={palette.textSubtle} />
            </Pressable>
            {idx < roles.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>

      <BottomSheet
        visible={edit !== null}
        onClose={() => setEdit(null)}
        title={edit?.name ?? "Role"}
        footer={
          edit ? (
            <FormActions
              primaryLabel="Save permissions"
              onPrimary={() => void save()}
              primaryLoading={saving}
              onSecondary={() => setEdit(null)}
            />
          ) : undefined
        }
      >
        {edit ? (
          <View className="gap-2">
            <Text style={{ fontFamily: font.regular }} className="mb-2 text-sm text-textMuted">
              {edit.description}
            </Text>
            {groups.map((group) => (
              <View key={group} className="mb-3">
                <Text style={{ fontFamily: font.semibold }} className="mb-2 text-sm text-text">
                  {group}
                </Text>
                {catalog
                  .filter((p) => p.group === group)
                  .map((p) => (
                    <View
                      key={p.key}
                      className="flex-row items-center justify-between border-b border-border py-2.5"
                    >
                      <Text style={{ fontFamily: font.regular }} className="flex-1 text-sm text-text">
                        {p.label}
                      </Text>
                      <Switch
                        value={edit.permissions.includes(p.key)}
                        onValueChange={() => togglePerm(p.key)}
                      />
                    </View>
                  ))}
              </View>
            ))}
          </View>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}
