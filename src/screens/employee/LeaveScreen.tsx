import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Plane, Plus } from "lucide-react-native";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { LeaveBalanceCard } from "@/components/shared/LeaveBalanceCard";
import { LeaveRequestCard } from "@/components/shared/LeaveRequestCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useHrmsData } from "@/context/HrmsDataContext";
import { formatLeaveFormDate } from "@/utils/dates";
import type { LeaveType } from "@/types";

const leaveTypes: { id: LeaveType; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "sick", label: "Sick" },
  { id: "earned", label: "Earned" },
  { id: "unpaid", label: "Unpaid" },
];

export function LeaveScreen({ embedded = false }: { embedded?: boolean }) {
  const { leaveBalances, myLeaveRequestsList, addLeaveRequest } = useHrmsData();
  const [applyOpen, setApplyOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>("casual");
  const [from, setFrom] = useState(() => formatLeaveFormDate());
  const [to, setTo] = useState(() => formatLeaveFormDate());
  const [days, setDays] = useState("1");
  const [reason, setReason] = useState("");

  const openApply = useCallback(() => {
    const today = formatLeaveFormDate();
    setFrom(today);
    setTo(today);
    setDays("1");
    setReason("");
    setLeaveType("casual");
    setApplyOpen(true);
  }, []);

  const orderedBalances = useMemo(
    () =>
      leaveTypes
        .map((t) => leaveBalances.find((b) => b.type === t.id))
        .filter(Boolean) as typeof leaveBalances,
    [leaveBalances],
  );

  const submit = useCallback(async () => {
    const n = Number(days);
    if (!reason.trim()) {
      Alert.alert("Add a reason", "Please enter a short reason for your leave.");
      return;
    }
    if (!Number.isFinite(n) || n <= 0) {
      Alert.alert("Invalid days", "Enter a positive number of days.");
      return;
    }
    await addLeaveRequest({
      type: leaveType,
      from: from.trim(),
      to: to.trim(),
      days: n,
      reason: reason.trim(),
    });
    setApplyOpen(false);
    setReason("");
    Alert.alert("Submitted", "Your request is in the admin queue. Check notifications for updates.");
  }, [addLeaveRequest, days, from, leaveType, reason, to]);

  return (
    <ScreenContainer embedded={embedded}>
      <Header
        title="Leave"
        subtitle="Apply → admin queue → approval updates balances & bell"
        right={<Button label="Apply" icon={Plus} size="sm" onPress={openApply} />}
        embedded={embedded}
      />

      <HelpBanner text="Submit leave here. After admin approval, your balance and notifications update automatically." />

      <SectionHeader title="Balances" />
      <View className="flex-row gap-3">
        <LeaveBalanceCard balance={orderedBalances[0]!} />
        <LeaveBalanceCard balance={orderedBalances[1]!} />
      </View>
      <View className="mt-3 flex-row gap-3">
        <LeaveBalanceCard balance={orderedBalances[2]!} />
        <LeaveBalanceCard balance={orderedBalances[3]!} />
      </View>

      <SectionHeader title="My requests" actionLabel="New request" onAction={openApply} />
      <View className="gap-3">
        {myLeaveRequestsList.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No leave requests yet"
            description="Submit a request — it appears instantly under My requests and on the admin Requests tab for approval."
            actionLabel="Apply for leave"
            onAction={openApply}
          />
        ) : (
          myLeaveRequestsList.map((r) => <LeaveRequestCard key={r.id} request={r} />)
        )}
      </View>

      <BottomSheet
        visible={applyOpen}
        title="Apply for leave"
        onClose={() => setApplyOpen(false)}
        footer={<Button label="Submit request" fullWidth onPress={() => void submit()} />}
      >
        <Text className="mb-2 text-sm font-medium text-textMuted">Leave type</Text>
        <View className="mb-4 flex-row flex-wrap gap-2">
          {leaveTypes.map((t) => {
            const active = leaveType === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setLeaveType(t.id)}
                className={`rounded-full border px-3 py-2 ${
                  active ? "border-primary bg-primary-soft" : "border-border bg-surface"
                }`}
              >
                <Text className={`text-sm font-medium ${active ? "text-primary" : "text-text"}`}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="gap-3">
          <Input label="From" value={from} onChangeText={setFrom} placeholder="dd MMM yyyy" />
          <Input label="To" value={to} onChangeText={setTo} placeholder="dd MMM yyyy" />
          <Input
            label="Days"
            value={days}
            onChangeText={setDays}
            keyboardType="decimal-pad"
          />
          <Input
            label="Reason"
            value={reason}
            onChangeText={setReason}
            placeholder="Short note to your manager"
          />
        </View>
        <Text className="mt-3 text-xs text-textSubtle">
          Submitted requests show as pending here and on Admin → Requests. Approving updates
          the matching balance; you also get a home-screen notification.
        </Text>
      </BottomSheet>
    </ScreenContainer>
  );
}
