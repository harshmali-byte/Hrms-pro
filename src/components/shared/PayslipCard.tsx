import { Alert, Pressable, Text, View } from "react-native";
import { Download, Eye, FileText } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { palette, iconSizes } from "@/constants/theme";
import type { Payslip } from "@/types";
import { Badge } from "@/components/ui/Badge";

const formatCurrency = (n: number) =>
  `INR ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

interface Props {
  payslip: Payslip;
  onDownload?: (id: string) => void;
  onPreview?: (id: string) => void;
  onOpenDetail?: (payslip: Payslip) => void;
}

export function PayslipCard({ payslip, onDownload, onPreview, onOpenDetail }: Props) {
  const isProcessing = payslip.status === "processing";

  const showDetail = () => {
    if (onOpenDetail) {
      onOpenDetail(payslip);
      return;
    }
    Alert.alert(
      `${payslip.month} ${payslip.year}`,
      [
        `Net: ${formatCurrency(payslip.net)}`,
        `Gross: ${formatCurrency(payslip.gross)}`,
        `Deductions: ${formatCurrency(payslip.deductions)}`,
        `Status: ${payslip.status === "paid" ? "Paid" : "Processing"}`,
      ].join("\n"),
    );
  };

  return (
    <View className="flex-row items-center rounded-xl border border-border bg-surface p-4">
      <Pressable
        onPress={showDetail}
        className="min-h-[44px] flex-1 flex-row items-center active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={`Payslip details ${payslip.month}`}
      >
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
          <FileText size={iconSizes.sm} color={palette.primary} />
        </View>

        <View className="ml-3 flex-1">
          <View className="flex-row flex-wrap items-center">
            <Text style={{ fontFamily: font.semibold }} className="text-base text-text">
              {payslip.month} {payslip.year}
            </Text>
            {isProcessing ? (
              <View className="ml-2">
                <Badge label="Processing" tone="warning" />
              </View>
            ) : null}
          </View>
          <Text style={{ fontFamily: font.regular }} className="mt-0.5 text-sm text-textMuted">
            Net {formatCurrency(payslip.net)} - Gross {formatCurrency(payslip.gross)}
          </Text>
        </View>
      </Pressable>

      <View className="flex-row items-center">
        <Pressable
          onPress={() => onPreview?.(payslip.id)}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Preview payslip PDF"
          className={`h-10 w-10 items-center justify-center rounded-xl ${
            isProcessing ? "opacity-40" : "active:bg-surfaceMuted"
          }`}
        >
          <Eye size={iconSizes.sm} color={palette.primary} />
        </Pressable>

        <Pressable
          onPress={() => onDownload?.(payslip.id)}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Download payslip PDF"
          className={`h-10 w-10 items-center justify-center rounded-xl ${
            isProcessing ? "opacity-40" : "active:bg-surfaceMuted"
          }`}
        >
          <Download size={iconSizes.sm} color={palette.primary} />
        </Pressable>
      </View>
    </View>
  );
}
