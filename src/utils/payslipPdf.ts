import { ASQUARIFY } from "@/constants/company";
import type { Employee, Payslip } from "@/types";

type Row = {
  label: string;
  amount: number;
};

export type PayslipPdfDetails = {
  payslip: Payslip;
  employee: Employee | null;
  generatedOn?: Date;
};

const page = {
  width: 595,
  height: 842,
  margin: 42,
};

const formatCurrency = (amount: number) =>
  `INR ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const cleanText = (value: string | number | null | undefined) =>
  String(value ?? "-")
    .replace(/[^\x20-\x7E]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const escapePdfText = (value: string | number | null | undefined) =>
  cleanText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const moneyParts = (total: number, ratios: number[]) => {
  const parts = ratios.map((ratio) => Math.round(total * ratio));
  const diff = total - parts.reduce((sum, part) => sum + part, 0);
  parts[parts.length - 1] += diff;
  return parts;
};

function getEarningsRows(payslip: Payslip): Row[] {
  const [basic, hra, specialAllowance] = moneyParts(payslip.gross, [0.5, 0.25, 0.25]);
  return [
    { label: "Basic Salary", amount: basic },
    { label: "House Rent Allowance", amount: hra },
    { label: "Special Allowance", amount: specialAllowance },
  ];
}

function getDeductionRows(payslip: Payslip): Row[] {
  const professionalTax = Math.min(200, payslip.deductions);
  const remaining = payslip.deductions - professionalTax;
  const providentFund = Math.round(remaining * 0.45);
  const incomeTax = payslip.deductions - professionalTax - providentFund;
  return [
    { label: "Provident Fund", amount: providentFund },
    { label: "Professional Tax", amount: professionalTax },
    { label: "Income Tax / TDS", amount: incomeTax },
  ];
}

class PdfPage {
  private readonly lines: string[] = [];

  text(
    value: string | number | null | undefined,
    x: number,
    y: number,
    options: { size?: number; font?: "regular" | "bold"; align?: "left" | "right" } = {},
  ) {
    const size = options.size ?? 10;
    const font = options.font === "bold" ? "F2" : "F1";
    const escaped = escapePdfText(value);
    if (options.align === "right") {
      const approxWidth = cleanText(value).length * size * 0.5;
      x -= approxWidth;
    }
    this.lines.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escaped}) Tj ET`);
  }

  line(x1: number, y1: number, x2: number, y2: number, width = 0.8) {
    this.lines.push(`${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  }

  rect(x: number, y: number, width: number, height: number, fill?: string) {
    if (fill) {
      this.lines.push(`${fill} rg ${x} ${y} ${width} ${height} re f 0 g`);
      return;
    }
    this.lines.push(`${x} ${y} ${width} ${height} re S`);
  }

  stream() {
    return this.lines.join("\n");
  }
}

function buildObjects(stream: string) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefAt = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
  return body;
}

function addKeyValue(pdf: PdfPage, label: string, value: string, x: number, y: number) {
  pdf.text(label.toUpperCase(), x, y, { size: 7, font: "bold" });
  pdf.text(value, x, y - 13, { size: 10 });
}

function addAmountTable(
  pdf: PdfPage,
  title: string,
  rows: Row[],
  totalLabel: string,
  total: number,
  x: number,
  y: number,
  width: number,
) {
  pdf.rect(x, y - 20, width, 20, "0.95 0.97 1");
  pdf.text(title, x + 10, y - 14, { size: 10, font: "bold" });
  let cursor = y - 42;
  rows.forEach((row) => {
    pdf.text(row.label, x + 10, cursor, { size: 9 });
    pdf.text(formatCurrency(row.amount), x + width - 10, cursor, {
      size: 9,
      align: "right",
    });
    cursor -= 22;
  });
  pdf.line(x + 10, cursor + 9, x + width - 10, cursor + 9, 0.6);
  pdf.text(totalLabel, x + 10, cursor - 6, { size: 10, font: "bold" });
  pdf.text(formatCurrency(total), x + width - 10, cursor - 6, {
    size: 10,
    font: "bold",
    align: "right",
  });
}

export function createPayslipPdf(details: PayslipPdfDetails) {
  const { payslip, employee, generatedOn = new Date() } = details;
  const pdf = new PdfPage();
  const left = page.margin;
  const right = page.width - page.margin;
  const contentWidth = right - left;
  const period = `${payslip.month} ${payslip.year}`;
  const earnings = getEarningsRows(payslip);
  const deductions = getDeductionRows(payslip);
  const generatedLabel = generatedOn.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  pdf.rect(0, page.height - 112, page.width, 112, "0.93 0.96 1");
  pdf.text(ASQUARIFY.displayName, left, 780, { size: 24, font: "bold" });
  pdf.text(ASQUARIFY.legalName, left, 758, { size: 10 });
  pdf.text(ASQUARIFY.address, left, 742, { size: 9 });
  pdf.text("Payslip", right, 780, { size: 22, font: "bold", align: "right" });
  pdf.text(period, right, 758, { size: 12, align: "right" });
  pdf.text(`Generated ${generatedLabel}`, right, 742, { size: 9, align: "right" });

  pdf.text("Employee Information", left, 690, { size: 13, font: "bold" });
  pdf.line(left, 681, right, 681);
  addKeyValue(pdf, "Employee Name", employee?.name ?? "Employee", left, 660);
  addKeyValue(pdf, "Employee Code", employee?.employeeCode ?? employee?.id ?? "-", left + 170, 660);
  addKeyValue(pdf, "Department", employee?.department ?? "-", left + 340, 660);
  addKeyValue(pdf, "Designation", employee?.role ?? "-", left, 620);
  addKeyValue(pdf, "Email", employee?.email ?? "-", left + 170, 620);
  addKeyValue(pdf, "Location", employee?.location ?? ASQUARIFY.headquarters, left + 340, 620);

  pdf.text("Pay Summary", left, 560, { size: 13, font: "bold" });
  pdf.line(left, 551, right, 551);
  addKeyValue(pdf, "Payslip ID", payslip.id, left, 530);
  addKeyValue(pdf, "Pay Period", period, left + 170, 530);
  addKeyValue(pdf, "Payment Status", payslip.status === "paid" ? "Paid" : "Processing", left + 340, 530);
  addKeyValue(pdf, "Gross Pay", formatCurrency(payslip.gross), left, 490);
  addKeyValue(pdf, "Total Deductions", formatCurrency(payslip.deductions), left + 170, 490);
  addKeyValue(pdf, "Net Pay", formatCurrency(payslip.net), left + 340, 490);

  const tableY = 430;
  const tableGap = 18;
  const tableWidth = (contentWidth - tableGap) / 2;
  addAmountTable(pdf, "Earnings", earnings, "Gross Earnings", payslip.gross, left, tableY, tableWidth);
  addAmountTable(
    pdf,
    "Deductions",
    deductions,
    "Total Deductions",
    payslip.deductions,
    left + tableWidth + tableGap,
    tableY,
    tableWidth,
  );

  pdf.rect(left, 116, contentWidth, 58, "0.93 0.98 0.96");
  pdf.text("Net Salary Payable", left + 16, 148, { size: 11, font: "bold" });
  pdf.text(formatCurrency(payslip.net), right - 16, 146, {
    size: 18,
    font: "bold",
    align: "right",
  });
  pdf.text("This is a computer-generated payslip and does not require a signature.", left, 82, {
    size: 8,
  });
  pdf.text(`${ASQUARIFY.website} | ${ASQUARIFY.headquarters}`, right, 82, {
    size: 8,
    align: "right",
  });

  return buildObjects(pdf.stream());
}

export function buildPayslipFileName(payslip: Payslip, employee: Employee | null) {
  const employeeCode = employee?.employeeCode ?? employee?.id ?? "employee";
  return `${employeeCode}-${payslip.month}-${payslip.year}-payslip.pdf`.replace(/\s+/g, "-");
}
