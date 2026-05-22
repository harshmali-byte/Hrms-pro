import { Alert, Platform, Pressable, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import { PayslipCard } from "@/components/shared/PayslipCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { useHrmsData } from "@/context/HrmsDataContext";
import { buildPayslipFileName, createPayslipPdf } from "@/utils/payslipPdf";

const formatCurrency = (n: number) =>
  `INR ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function PayslipScreen({ embedded = false }: { embedded?: boolean }) {
  const { currentEmployee, payslips } = useHrmsData();
  const ytdGross = payslips.reduce((sum, p) => sum + p.gross, 0);
  const ytdNet = payslips.reduce((sum, p) => sum + p.net, 0);
  const ytdTax = ytdGross - ytdNet;

  const onDownload = (id: string) => {
    const slip = payslips.find((p) => p.id === id);
    if (!slip) {
      Alert.alert("Payslip unavailable", "Could not find this payslip. Please refresh and try again.");
      return;
    }

    if (slip.status !== "paid") {
      Alert.alert("Payslip processing", "This payslip will be available once payroll is marked paid.");
      return;
    }

    if (Platform.OS !== "web") {
      Alert.alert(
        "Download available on web",
        "PDF generation is ready for the web app. Native file saving needs Expo FileSystem/Sharing to be added.",
      );
      return;
    }

    const pdf = createPayslipPdf({ payslip: slip, employee: currentEmployee });
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildPayslipFileName(slip, currentEmployee);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onPreview = (id: string) => {
    const slip = payslips.find((p) => p.id === id);
    if (!slip) {
      Alert.alert("Payslip unavailable", "Could not find this payslip. Please refresh and try again.");
      return;
    }

    if (slip.status !== "paid") {
      Alert.alert("Payslip processing", "This payslip will be available once payroll is marked paid.");
      return;
    }

    if (Platform.OS !== "web") {
      Alert.alert(
        "Preview available on web",
        "PDF preview is ready for the web app. Native preview needs Expo FileSystem/Sharing to be added.",
      );
      return;
    }

    const pdf = createPayslipPdf({ payslip: slip, employee: currentEmployee });
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      Alert.alert("Preview blocked", "Allow pop-ups for this site to preview the payslip PDF.");
      URL.revokeObjectURL(url);
      return;
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Payslips" subtitle="Your earnings, year to date" embedded={embedded} />

      <HelpBanner text="Tap a payslip for breakdown. Preview or download paid monthly payslips as formatted PDFs." />

      <Pressable
        onPress={() =>
          Alert.alert(
            "Year to date summary",
            [
              `Net: ${formatCurrency(ytdNet)}`,
              `Gross: ${formatCurrency(ytdGross)}`,
              `Tax & deductions: ${formatCurrency(ytdTax)}`,
              "",
              "Monthly PDF payslips are available from the list below.",
            ].join("\n"),
          )
        }
        accessibilityRole="button"
        className="active:opacity-90"
      >
        <Card variant="default">
          <Text className="text-sm text-textMuted">Year to date - 2026 - tap for summary</Text>
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
            "Use the download button on each paid month to get its formatted PDF payslip.",
          )
        }
      />
      <View className="gap-3">
        {payslips.map((p) => (
          <PayslipCard key={p.id} payslip={p} onDownload={onDownload} onPreview={onPreview} />
        ))}
      </View>
    </ScreenContainer>
  );
}
