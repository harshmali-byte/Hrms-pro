import { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { font } from "@/constants/fonts";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Divider } from "@/components/ui/Divider";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { PayslipCard } from "@/components/shared/PayslipCard";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { useHrmsData } from "@/context/HrmsDataContext";
import { buildPayslipFileName, createPayslipPdf } from "@/utils/payslipPdf";
import type { Payslip } from "@/types";

const formatCurrency = (n: number) =>
  `INR ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function PayslipScreen({ embedded = false }: { embedded?: boolean }) {
  const { currentEmployee, payslips } = useHrmsData();
  const ytdGross = payslips.reduce((sum, p) => sum + p.gross, 0);
  const ytdNet = payslips.reduce((sum, p) => sum + p.net, 0);
  const ytdTax = ytdGross - ytdNet;
  const [ytdOpen, setYtdOpen] = useState(false);
  const [detailSlip, setDetailSlip] = useState<Payslip | null>(null);

  const downloadPdf = (slip: Payslip) => {
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

  const previewPdf = (slip: Payslip) => {
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
    downloadPdf(slip);
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
    previewPdf(slip);
  };

  const exportAllPaid = () => {
    const paid = payslips.filter((p) => p.status === "paid");
    if (!paid.length) {
      Alert.alert("No paid slips", "Paid payslips appear after admin publishes payroll.");
      return;
    }
    if (Platform.OS !== "web") {
      Alert.alert("Export on web", "Bulk download is available in the web app.");
      return;
    }
    paid.forEach((slip, i) => {
      window.setTimeout(() => downloadPdf(slip), i * 400);
    });
    Alert.alert("Downloading", `Starting download of ${paid.length} payslip PDF(s).`);
  };

  return (
    <ScreenContainer embedded={embedded}>
      <Header title="Payslips" subtitle="Your earnings, year to date" embedded={embedded} />

      <HelpBanner text="Tap a payslip for breakdown. Preview or download paid monthly payslips as formatted PDFs." />

      <Pressable onPress={() => setYtdOpen(true)} accessibilityRole="button" className="active:opacity-90">
        <Card variant="default">
          <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
            Year to date · tap for summary
          </Text>
          <Text style={{ fontFamily: font.bold }} className="mt-1 text-3xl text-text">
            {formatCurrency(ytdNet)}
          </Text>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
            Net earnings ({payslips.length} months)
          </Text>

          <Divider className="my-4" />

          <View className="flex-row">
            <View className="flex-1">
              <Text style={{ fontFamily: font.regular }} className="text-xs text-textMuted">
                Gross
              </Text>
              <Text style={{ fontFamily: font.semibold }} className="mt-1 text-base text-text">
                {formatCurrency(ytdGross)}
              </Text>
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: font.regular }} className="text-xs text-textMuted">
                Tax & deductions
              </Text>
              <Text style={{ fontFamily: font.semibold }} className="mt-1 text-base text-text">
                {formatCurrency(ytdTax)}
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>

      <SectionHeader title="Monthly payslips" actionLabel="Export paid" onAction={exportAllPaid} />
      <View className="gap-3">
        {payslips.length === 0 ? (
          <Card>
            <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
              No payslips yet. They appear when payroll is published for your account.
            </Text>
          </Card>
        ) : (
          payslips.map((p) => (
            <PayslipCard
              key={p.id}
              payslip={p}
              onDownload={onDownload}
              onPreview={onPreview}
              onOpenDetail={setDetailSlip}
            />
          ))
        )}
      </View>

      <BottomSheet visible={ytdOpen} title="Year to date" onClose={() => setYtdOpen(false)}>
        <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
          {[
            `Net: ${formatCurrency(ytdNet)}`,
            `Gross: ${formatCurrency(ytdGross)}`,
            `Tax & deductions: ${formatCurrency(ytdTax)}`,
            "",
            `Paid slips: ${payslips.filter((p) => p.status === "paid").length}`,
            `Processing: ${payslips.filter((p) => p.status === "processing").length}`,
          ].join("\n")}
        </Text>
      </BottomSheet>

      <BottomSheet
        visible={detailSlip != null}
        title={detailSlip ? `${detailSlip.month} ${detailSlip.year}` : "Payslip"}
        onClose={() => setDetailSlip(null)}
        footer={
          detailSlip?.status === "paid" ? (
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Button label="Preview" variant="secondary" fullWidth onPress={() => previewPdf(detailSlip!)} />
              </View>
              <View className="flex-1">
                <Button label="Download" fullWidth onPress={() => downloadPdf(detailSlip!)} />
              </View>
            </View>
          ) : (
            <Button label="Close" variant="secondary" fullWidth onPress={() => setDetailSlip(null)} />
          )
        }
      >
        {detailSlip ? (
          <Text style={{ fontFamily: font.regular }} className="text-sm leading-6 text-text">
            {[
              `Status: ${detailSlip.status}`,
              `Gross: ${formatCurrency(detailSlip.gross)}`,
              `Deductions: ${formatCurrency(detailSlip.deductions)}`,
              `Net: ${formatCurrency(detailSlip.net)}`,
            ].join("\n")}
          </Text>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}
