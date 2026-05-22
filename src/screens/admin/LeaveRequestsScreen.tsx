import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Inbox } from "lucide-react-native";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { LeaveRequestCard } from "@/components/shared/LeaveRequestCard";
import type { LeaveStatus } from "@/types";
import { useHrmsData } from "@/context/HrmsDataContext";
import { useAdminNav } from "@/context/AdminNavContext";

const tabs: { id: LeaveStatus | "all"; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export function LeaveRequestsScreen({ embedded = false }: { embedded?: boolean }) {
  const { leaveTab } = useAdminNav();
  const [tab, setTab] = useState<LeaveStatus | "all">(leaveTab);
  const { leaveRequests, setLeaveRequestStatus } = useHrmsData();

  useEffect(() => {
    setTab(leaveTab);
  }, [leaveTab]);

  const pendingCount = useMemo(
    () => leaveRequests.filter((r) => r.status === "pending").length,
    [leaveRequests],
  );

  const filtered = useMemo(
    () => (tab === "all" ? leaveRequests : leaveRequests.filter((r) => r.status === tab)),
    [tab, leaveRequests],
  );

  return (
    <ScreenContainer embedded={embedded}>
      <Header
        title="Leave requests"
        subtitle={`${pendingCount} awaiting your decision`}
        embedded={embedded}
      />

      <HelpBanner text="Approve or reject pending requests. The employee is notified and leave balances update on approval." />

      <View className="flex-row rounded-md border border-border bg-surface p-1">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              className={`flex-1 items-center rounded-md py-2 ${
                active ? "bg-primary-soft" : ""
              }`}
            >
              <Text
                className={`text-sm font-medium ${active ? "text-primary" : "text-textMuted"}`}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4 gap-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nothing here"
            description="No requests match this filter."
          />
        ) : (
          filtered.map((r) => (
            <LeaveRequestCard
              key={`${r.id}-${r.employeeId}`}
              request={r}
              showEmployee
              showActions={r.status === "pending"}
              onApprove={(id) => void setLeaveRequestStatus(id, "approved")}
              onReject={(id) => void setLeaveRequestStatus(id, "rejected")}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}
