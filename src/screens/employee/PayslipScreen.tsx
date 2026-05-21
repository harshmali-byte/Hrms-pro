import { Alert, Pressable, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import { PayslipCard } from "@/components/shared/PayslipCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { useHrmsData } from "@/context/HrmsDataContext";

const formatCurrency = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function PayslipScreen({ embedded = false }: { embedded?: boolean }) {
  const { payslips } = useHrmsData();
  const ytdGross = payslips.reduce((sum, p) => sum + p.gross, 0);
  const ytdNet = payslips.reduce((sum, p) => sum + p.net, 0);
  const ytdTax = ytdGross - ytdNet;

  const onDownload = (id: string) => {
    const slip = payslips.find((p) => p.id === id);
    Alert.alert(
      "Download payslip",
      slip
        ? `Demo: ${slip.month} ${slip.year} (PDF) would download as ${id}.pdf`
        : `Demo: would download ${id}.pdf`,
    );
  };

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Payslips" subtitle="Your earnings, year to date" embedded={embedded} />

      <HelpBanner text="Tap a payslip for breakdown. Use download for a demo PDF receipt." />

      <Pressable
        onPress={() =>
          Alert.alert(
            "Year to date summary",
            [
              `Net: ${formatCurrency(ytdNet)}`,
              `Gross: ${formatCurrency(ytdGross)}`,
              `Tax & deductions: ${formatCurrency(ytdTax)}`,
              "",
              "Demo: full tax break-up and Form 16 would open from here.",
            ].join("\n"),
          )
        }
        accessibilityRole="button"
        className="active:opacity-90"
      >
        <Card variant="default">
          <Text className="text-sm text-textMuted">Year to date · 2026 · tap for summary</Text>
          <Text className="mt-1 text-3xl font-semibold text-text">
            {formatCurrency(ytdNet)}
          </Text>
          <Text className="mt-0.5 text-sm text-textMuted">Net earnings</Text>

          <Divider className="my-4" />

          <View className="flex-row">
            <View className="flex-1">
              <Text className="text-xs text-textMuted">Gross</Text>
              <Text className="mt-1 text-base font-semibold text-text">
                {formatCurrency(ytdGross)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-textMuted">Tax & deductions</Text>
              <Text className="mt-1 text-base font-semibold text-text">
                {formatCurrency(ytdTax)}
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>

      <SectionHeader
        title="Monthly payslips"
        actionLabel="Export all"
        onAction={() =>
          Alert.alert(
            "Export payslips",
            `Demo: would bundle ${payslips.length} PDFs and your YTD summary into a single zip.`,
          )
        }
      />
      <View className="gap-3">
        {payslips.map((p) => (
          <PayslipCard key={p.id} payslip={p} onDownload={onDownload} />
        ))}
      </View>
    </ScreenContainer>
  );
}
