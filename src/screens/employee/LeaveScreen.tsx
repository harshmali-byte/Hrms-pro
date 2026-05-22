import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Plane, Plus } from "lucide-react-native";
import { font } from "@/constants/fonts";
import type { LeaveRequest } from "@/types";
import type { LeavePolicy } from "@/types/config";
import type { LeaveBalance, LeaveType } from "@/types";
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
import { Badge } from "@/components/ui/Badge";
import { useHrmsData } from "@/context/HrmsDataContext";
import { formatLeaveFormDate } from "@/utils/dates";

const leaveTypes: { id: LeaveType; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "sick", label: "Sick" },
  { id: "earned", label: "Earned" },
  { id: "unpaid", label: "Unpaid" },
];

export function LeaveScreen({ embedded = false }: { embedded?: boolean }) {
  const { leaveBalances, leavePolicies, myLeaveRequestsList, addLeaveRequest, cancelLeaveRequest } =
    useHrmsData();
  const [applyOpen, setApplyOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>("casual");
  const [from, setFrom] = useState(() => formatLeaveFormDate());
  const [to, setTo] = useState(() => formatLeaveFormDate());
  const [days, setDays] = useState("1");
  const [reason, setReason] = useState("");
  const [policySheet, setPolicySheet] = useState<{
    policy: LeavePolicy | null;
    balance: LeaveBalance;
  } | null>(null);
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);

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

  const policyForType = useCallback(
    (type: LeaveType) => leavePolicies.find((p) => p.type === type && p.active) ?? null,
    [leavePolicies],
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
    const policy = policyForType(leaveType);
    if (policy && n > policy.daysPerYear) {
      Alert.alert("Too many days", `Policy allows up to ${policy.daysPerYear} days per year for ${policy.name}.`);
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
  }, [addLeaveRequest, days, from, leaveType, policyForType, reason, to]);

  const withdraw = (id: string) => {
    Alert.alert("Withdraw request?", "This removes your pending leave request.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Withdraw",
        style: "destructive",
        onPress: () => void cancelLeaveRequest(id),
      },
    ]);
  };

  return (
    <ScreenContainer embedded={embedded}>
      <Header
        title="Leave"
        subtitle="Apply → admin queue → approval updates balances & bell"
        right={<Button label="Apply" icon={Plus} size="sm" onPress={openApply} />}
        embedded={embedded}
      />

      <HelpBanner text="Submit leave here. Balances and policies load from the server. Withdraw pending requests anytime." />

      <SectionHeader title="Balances" />
      {orderedBalances.length === 0 ? (
        <Text style={{ fontFamily: font.regular }} className="mb-4 text-sm text-textMuted">
          Leave balances will appear after your profile is linked in HR.
        </Text>
      ) : (
        <>
          <View className="flex-row gap-3">
            {orderedBalances.slice(0, 2).map((b) => (
              <LeaveBalanceCard
                key={b.type}
                balance={b}
                policy={policyForType(b.type)}
                onPolicyPress={(policy, balance) => setPolicySheet({ policy, balance })}
              />
            ))}
          </View>
          {orderedBalances.length > 2 ? (
            <View className="mt-3 flex-row gap-3">
              {orderedBalances.slice(2, 4).map((b) => (
                <LeaveBalanceCard
                  key={b.type}
                  balance={b}
                  policy={policyForType(b.type)}
                  onPolicyPress={(policy, balance) => setPolicySheet({ policy, balance })}
                />
              ))}
            </View>
          ) : null}
        </>
      )}

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
          myLeaveRequestsList.map((r) => (
            <LeaveRequestCard
              key={r.id}
              request={r}
              onOpenDetail={setDetailRequest}
              onCancel={withdraw}
            />
          ))
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
            const policy = policyForType(t.id);
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
                {policy ? (
                  <Text className="text-[10px] text-textSubtle">{policy.daysPerYear}d/yr</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
        <View className="gap-3">
          <Input label="From" value={from} onChangeText={setFrom} placeholder="dd MMM yyyy" />
          <Input label="To" value={to} onChangeText={setTo} placeholder="dd MMM yyyy" />
          <Input label="Days" value={days} onChangeText={setDays} keyboardType="decimal-pad" />
          <Input
            label="Reason"
            value={reason}
            onChangeText={setReason}
            placeholder="Short note to your manager"
          />
        </View>
        {policyForType(leaveType) ? (
          <Text style={{ fontFamily: font.regular }} className="mt-3 text-xs text-textSubtle">
            {policyForType(leaveType)!.description}
          </Text>
        ) : null}
      </BottomSheet>

      <BottomSheet
        visible={policySheet != null}
        title={policySheet?.policy?.name ?? "Leave policy"}
        onClose={() => setPolicySheet(null)}
      >
        {policySheet ? (
          <>
            <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
              {Math.max(0, policySheet.balance.total - policySheet.balance.used)} of{" "}
              {policySheet.balance.total} days remaining · {policySheet.balance.used} used
            </Text>
            {policySheet.policy ? (
              <>
                <View className="mt-3 flex-row flex-wrap gap-2">
                  <Badge label={policySheet.policy.isPaid ? "Paid" : "Unpaid"} tone="info" />
                  <Badge label={`Min notice ${policySheet.policy.minNoticeDays}d`} tone="neutral" />
                </View>
                <Text style={{ fontFamily: font.regular }} className="mt-4 text-sm leading-6 text-text">
                  {policySheet.policy.description ?? "No additional policy notes."}
                </Text>
              </>
            ) : (
              <Text style={{ fontFamily: font.regular }} className="mt-4 text-sm text-textMuted">
                No published policy for this leave type.
              </Text>
            )}
          </>
        ) : null}
      </BottomSheet>

      <BottomSheet
        visible={detailRequest != null}
        title="Leave request"
        onClose={() => setDetailRequest(null)}
      >
        {detailRequest ? (
          <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
            {[
              `Type: ${detailRequest.type}`,
              `Dates: ${detailRequest.from} → ${detailRequest.to}`,
              `Days: ${detailRequest.days}`,
              `Reason: ${detailRequest.reason}`,
              `Status: ${detailRequest.status}`,
              `Applied: ${detailRequest.appliedOn}`,
            ].join("\n")}
          </Text>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}
