import { useCallback } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { CheckCircle2, Clock, Coins, PiggyBank, Users } from "lucide-react-native";
import { palette, iconSizes } from "@/constants/theme";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { useHrmsData } from "@/context/HrmsDataContext";

const formatCompact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const stepHint: Record<string, string> = {
  "Attendance reconciled":
    "Demo: pulls approved attendance and exceptions from the time system. Finance can override cells before lock.",
  "Reimbursements added":
    "Demo: merges approved expense batches into this cycle’s variable pay.",
  "Tax & deductions":
    "Demo: runs statutory deductions (PF, ESI, TDS) and benefit recovery before net pay.",
  "Approvals & disbursal":
    "Demo: CFO sign-off and bank file generation; employees get payslip mailers.",
};

export function PayrollScreen({ embedded = false }: { embedded?: boolean }) {
  const { payroll, advancePayrollRun, publishPayslips, employees, departments, payrollSummary } = useHrmsData();
  const { steps, runStatus } = payroll;
  const avgSalaryPerHead = payrollSummary?.avgSalaryPerHead ?? 142000;
  const monthlyOutflow =
    payrollSummary?.estimatedMonthlyOutflow ?? employees.length * avgSalaryPerHead;

  const advanceRun = useCallback(async () => {
    const next = await advancePayrollRun();
    if (next?.runStatus === "Locked") {
      Alert.alert("Payroll complete", "May cycle is locked. You can now publish payslips.");
    }
  }, [advancePayrollRun]);

  const publishRun = useCallback(async () => {
    try {
      const count = await publishPayslips();
      Alert.alert("Payslips published", `${count} employee payslip(s) were saved and are available to download.`);
    } catch (e) {
      Alert.alert("Publish failed", e instanceof Error ? e.message : "Could not publish payslips.");
    }
  }, [publishPayslips]);

  const preview = useCallback(() => {
    Alert.alert(
      "Preview registers",
      `${formatCompact(monthlyOutflow)} gross across ${employees.length} employees. PDF preview would open here (demo).`,
    );
  }, [employees.length, monthlyOutflow]);

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Payroll" subtitle="May 2026 cycle" embedded={embedded} />

      <HelpBanner text="Advance the payroll checklist step by step. Progress and published payslips are saved to the backend." />

      <View className="flex-row flex-wrap gap-3">
        <StatCard
          label="Monthly outflow"
          value={formatCompact(monthlyOutflow)}
          icon={Coins}
          accent={palette.primary}
          onPress={() =>
            Alert.alert(
              "Monthly outflow",
              `Approx. gross cash-out: ${formatCompact(monthlyOutflow)} for ${employees.length} employees.`,
            )
          }
        />
        <StatCard
          label="Headcount"
          value={employees.length}
          icon={Users}
          accent="#0EA5E9"
          onPress={() =>
            Alert.alert(
              "Headcount",
              `${employees.length} active employees included in this payroll cycle.`,
            )
          }
        />
      </View>
      <View className="mt-3 flex-row gap-3">
        <StatCard
          label="Avg CTC"
          value={formatCompact(avgSalaryPerHead)}
          icon={PiggyBank}
          accent="#10B981"
          onPress={() =>
            Alert.alert(
              "Average CTC",
              `Demo average loaded CTC per employee: ${formatCompact(avgSalaryPerHead)}. Real figures would come from HR master data.`,
            )
          }
        />
        <StatCard
          label="Run status"
          value={runStatus}
          icon={Clock}
          accent="#F59E0B"
          onPress={() =>
            Alert.alert(
              "Payroll run",
              runStatus === "Locked"
                ? "This cycle is locked. Use support to reopen (demo)."
                : "Run is in progress — use Continue run to advance checklist steps.",
            )
          }
        />
      </View>

      <SectionHeader title="May payroll run" />
      <Card>
        <Pressable
          onPress={() =>
            Alert.alert(
              "May 2026 payroll run",
              [
                `Status: ${runStatus}`,
                "Cycle: May 1 – May 31, 2026",
                "Disbursal: 31 May 2026",
                "",
                "Tap each checklist row below for what that step does in production.",
              ].join("\n"),
            )
          }
          accessibilityRole="button"
          className="active:opacity-90"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-semibold text-text">Cycle May 1 – May 31</Text>
              <Text className="mt-0.5 text-sm text-textMuted">
                Disbursal scheduled · 31 May 2026 · tap for summary
              </Text>
            </View>
            <Badge
              label={runStatus === "Locked" ? "Locked" : "In progress"}
              tone={runStatus === "Locked" ? "success" : "warning"}
            />
          </View>
        </Pressable>

        <Divider className="my-4" />

        <View className="gap-3">
          {steps.map((s) => (
            <Pressable
              key={s.label}
              onPress={() => Alert.alert(s.label, stepHint[s.label] ?? "Demo checkpoint.")}
              accessibilityRole="button"
              className="flex-row items-center active:opacity-80"
            >
              <CheckCircle2
                size={iconSizes.sm}
                color={s.done ? palette.success : palette.borderStrong}
              />
              <Text className={`ml-3 flex-1 text-sm ${s.done ? "text-text" : "text-textMuted"}`}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-4 flex-row flex-wrap justify-end gap-2">
          <Button label="Preview" variant="secondary" size="sm" onPress={preview} />
          <Button
            label={runStatus === "Locked" ? "Publish payslips" : "Continue run"}
            size="sm"
            onPress={() => void (runStatus === "Locked" ? publishRun() : advanceRun())}
          />
        </View>
      </Card>

      <SectionHeader title="By department" />
      <Card>
        {departments.map((d, idx) => (
          <View key={d.name}>
            <Pressable
              onPress={() =>
                Alert.alert(
                  d.name,
                  `Demo: ${d.headcount} people · Estimated payroll ${formatCompact(d.headcount * avgSalaryPerHead)}`,
                )
              }
              className="active:opacity-80"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <Text className="ml-2 text-sm text-text">{d.name}</Text>
                </View>
                <Text className="text-sm font-medium text-text">
                  {formatCompact(d.headcount * avgSalaryPerHead)}
                </Text>
              </View>
            </Pressable>
            {idx < departments.length - 1 ? <Divider className="my-3" /> : null}
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}
