import { useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { fetchAuditLog } from "@/api/configApi";
import { ApiError } from "@/api/client";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { ConfigBackBar } from "./ConfigBackBar";
import { font } from "@/constants/fonts";
import type { AuditLogEntry } from "@/types/config";

function actionTone(action: string): "success" | "warning" | "danger" | "neutral" {
  if (action === "approved" || action === "create") return "success";
  if (action === "rejected" || action === "delete") return "danger";
  if (action === "update") return "warning";
  return "neutral";
}

export function AuditLogConfig({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);

  const load = useCallback(() => {
    fetchAuditLog(80)
      .then(setEntries)
      .catch((e) => Alert.alert("Error", e instanceof ApiError ? e.message : "Load failed"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenContainer embedded>
      <ConfigBackBar title="Security & audit log" onBack={onBack} />
      <HelpBanner text="Every configuration change and leave approval is recorded here." />

      <View className="gap-3">
        {entries.map((e) => (
          <Card key={e.id}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
                  {e.details ?? `${e.action} · ${e.resource}`}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="mt-1 text-sm text-textMuted">
                  {e.userName} · {e.createdAt}
                </Text>
              </View>
              <Badge label={e.action} tone={actionTone(e.action)} />
            </View>
          </Card>
        ))}
        {entries.length === 0 ? (
          <Text style={{ fontFamily: font.regular }} className="text-center text-textMuted">
            No audit entries yet.
          </Text>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
