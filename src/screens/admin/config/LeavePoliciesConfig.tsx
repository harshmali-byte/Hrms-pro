import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import {
  fetchLeavePolicies,
  updateLeavePolicy,
} from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import { font } from "@/constants/fonts";
import { iconSizes, palette } from "@/constants/theme";
import type { LeavePolicy } from "@/types/config";

export function LeavePoliciesConfig({ onBack }: { onBack: () => void }) {
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [edit, setEdit] = useState<LeavePolicy | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchLeavePolicies()
      .then(setPolicies)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveEdit = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      await updateLeavePolicy(edit.id, {
        name: edit.name,
        daysPerYear: edit.daysPerYear,
        carryForwardLimit: edit.carryForwardLimit,
        minNoticeDays: edit.minNoticeDays,
        isPaid: edit.isPaid,
        requiresApproval: edit.requiresApproval,
        active: edit.active,
        description: edit.description,
      });
      setEdit(null);
      load();
      Alert.alert("Saved", "Leave policy updated.");
    } catch (e) {
      Alert.alert("Error", e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const syncBalances = () => {
    if (!edit) return;
    Alert.alert(
      "Sync employee balances?",
      `Set all employees' ${edit.type} leave total to ${edit.daysPerYear} days?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sync",
          onPress: async () => {
            try {
              await updateLeavePolicy(edit.id, {
                daysPerYear: edit.daysPerYear,
                syncBalances: true,
              });
              Alert.alert("Done", "Employee leave balances updated.");
              setEdit(null);
              load();
            } catch (e) {
              Alert.alert("Error", e instanceof ApiError ? e.message : "Sync failed");
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Leave policies" onBack={onBack} />
      <HelpBanner text="Define accrual, notice, and approval rules. Tap a policy to edit; sync balances after changing annual days." />

      <Card padded={false} elevated={false} className="overflow-hidden">
        {policies.map((p, idx) => (
          <View key={p.id}>
            <Pressable
              onPress={() => setEdit({ ...p })}
              className="flex-row items-center px-4 py-3.5 active:bg-surfaceMuted"
            >
              <View className="flex-1">
                <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                  {p.name}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
                  {p.daysPerYear} days/yr · carry {p.carryForwardLimit} · notice {p.minNoticeDays}d
                </Text>
              </View>
              <Badge label={p.active ? "Active" : "Off"} tone={p.active ? "success" : "neutral"} />
              <ChevronRight size={iconSizes.sm} color={palette.textSubtle} style={{ marginLeft: 8 }} />
            </Pressable>
            {idx < policies.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </Card>

      <BottomSheet
        visible={edit !== null}
        onClose={() => setEdit(null)}
        title={edit?.name ?? "Edit policy"}
      >
        {edit ? (
          <View className="gap-3">
            <Input label="Policy name" value={edit.name} onChangeText={(v) => setEdit({ ...edit, name: v })} />
            <Input
              label="Days per year"
              value={String(edit.daysPerYear)}
              keyboardType="number-pad"
              onChangeText={(v) => setEdit({ ...edit, daysPerYear: Number(v) || 0 })}
            />
            <Input
              label="Carry-forward limit"
              value={String(edit.carryForwardLimit)}
              keyboardType="number-pad"
              onChangeText={(v) => setEdit({ ...edit, carryForwardLimit: Number(v) || 0 })}
            />
            <Input
              label="Min notice (days)"
              value={String(edit.minNoticeDays)}
              keyboardType="number-pad"
              onChangeText={(v) => setEdit({ ...edit, minNoticeDays: Number(v) || 0 })}
            />
            <View className="flex-row items-center justify-between py-2">
              <Text style={{ fontFamily: font.medium }} className="text-text">
                Paid leave
              </Text>
              <Switch
                value={edit.isPaid}
                onValueChange={(v) => setEdit({ ...edit, isPaid: v })}
              />
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text style={{ fontFamily: font.medium }} className="text-text">
                Requires approval
              </Text>
              <Switch
                value={edit.requiresApproval}
                onValueChange={(v) => setEdit({ ...edit, requiresApproval: v })}
              />
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text style={{ fontFamily: font.medium }} className="text-text">
                Active
              </Text>
              <Switch value={edit.active} onValueChange={(v) => setEdit({ ...edit, active: v })} />
            </View>
            <Input
              label="Description"
              value={edit.description ?? ""}
              onChangeText={(v) => setEdit({ ...edit, description: v })}
              multiline
            />
            <Button label="Save policy" fullWidth loading={saving} onPress={() => void saveEdit()} />
            <Button
              label="Sync balances to employees"
              variant="secondary"
              fullWidth
              onPress={syncBalances}
            />
          </View>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}
