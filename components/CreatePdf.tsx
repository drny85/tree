import { Client, companyInfo, Invoice, InvoiceItem } from "@/typing";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import "jspdf-autotable";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { File } from "lucide-react";
import { getDiscountAmount } from "@/utils/getDiscountAmount";
import { formatUSD } from "@/utils/formatDollar";

type Props = {
  invoiceDetails: Invoice;
  client: Client | null;
  invoiceItems?: InvoiceItem[];
};
export default function CreatePdf({
  invoiceDetails,
  client,
  invoiceItems,
}: Props) {
  const subTotal = useMemo(() => {
    if (!invoiceItems) return 0;
    return invoiceItems.reduce(
      (acc, item) => acc + item.rate * item.quantity,
      0,
    );
  }, [invoiceItems]);

  const discount = useMemo(() => {
    if (!invoiceDetails) return 0;
    return invoiceDetails.discount;
  }, [invoiceDetails]);

  const discountAmount = useMemo(() => {
    if (!invoiceDetails || !invoiceDetails.discount) return 0;

    const amount = getDiscountAmount(subTotal, discount || 0);
    return amount;
  }, [invoiceDetails, subTotal, discount]);
  const total = useMemo(() => {
    if (!invoiceItems) return 0;
    const t = invoiceItems.reduce(
      (acc, item) => acc + item.rate * item.quantity,
      0,
    );
    if (discount && discount > 0) return t - (t * discount) / 100;
    // Apply discoun
    return t;
  }, [invoiceItems, discount]);

  const drawLogo = (
    doc: jsPDF,
    startX: number,
    startY: number,
    size: number,
  ) => {
    const logoUrl = "/main-logo.png";
    const img = new Image();
    img.src = logoUrl;
    doc.addImage(img, "PNG", startX, startY, size, size);
  };

  const createPdf = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const startX = pageWidth * 0.05;
    const endX = pageWidth - pageWidth * 0.1;
    // Add invoice information horizontally
    // Add invoice information

    drawLogo(doc, startX, 10, 30); // Adjust the size as needed

    doc.setFontSize(12);
    doc.text(
      `Invoice Number: ${invoiceDetails.invoiceNumber}`,
      pageWidth / 2 - 20,
      20,
    ); // Centered in the second section
    doc.text(`Date: ${format(new Date().toISOString(), "PP")}`, endX - 30, 20); // Centered in the third section

    // Add company information on the left

    doc.setFontSize(14);
    doc.text(companyInfo.name, startX, 42);
    doc.setFontSize(10);

    doc.text(`City: ${companyInfo.city}`, startX, 48);
    doc.text(`Phone: ${companyInfo.phone}`, startX, 54);
    doc.text(`Email: ${companyInfo.email}`, startX, 60);

    // Add client information on the right
    const clientInfoX = 100;
    doc.setFontSize(14); // Adjust this value to position client info
    doc.text(`Client: ${client?.name}`, clientInfoX, 42);
    doc.setFontSize(10);
    doc.text(
      `Address: ${client?.address || "No Address Provided"}`,
      clientInfoX,
      48,
    );
    doc.text(`Email: ${client?.email}`, clientInfoX, 54);
    doc.text(`Phone: ${client?.phone}`, clientInfoX, 60);

    // Add items table
    doc.setFontSize(12);
    doc.text(`Invoice Status: ${invoiceDetails.status}`, startX, 76);
    doc.setFontSize(10);
    autoTable(doc, {
      startY: 80,
      headStyles: { fillColor: [100, 100, 100] },
      margin: { top: 10, left: 10, right: 10 },

      columnStyles: {
        0: { cellWidth: "wrap" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
      head: [["Description", "Quantity", "Rate", "Amount"]],
      body:
        invoiceItems?.map((item) => [
          item.description,
          item.quantity.toString(),
          `$${item.rate.toFixed(2)}`,
          `$${item.amount.toFixed(2)}`,
        ]) || [],

      tableLineColor: [200, 200, 200],
      tableLineWidth: 0.2,
    });

    // Add totals
    // Add totals
    const finalY = (doc as unknown as any).lastAutoTable?.finalY || 130;

    const rightAlignX = pageWidth - 16; // Adjust this value for padding

    doc.text(`Subtotal: ${formatUSD(subTotal)}`, rightAlignX, finalY + 10, {
      align: "right",
    });
    if (discountAmount > 0) {
      doc.setFontSize(8);
      doc.setTextColor(230, 0, 0);
      doc.text(
        `Discount (${discount}%): -$${discountAmount.toFixed(2)}`,
        rightAlignX,
        finalY + 15,
        { align: "right" },
      );
    }
    doc.setTextColor(0, 0, 0); // Reset text color

    // doc.text(
    //   `Tax (8%): $${invoiceDetails.tax.toFixed(2)}`,
    //   rightAlignX,
    //   finalY + 20,
    //   { align: "right" },
    // );
    doc.setFontSize(14);
    doc.text(`Total: ${formatUSD(total)}`, rightAlignX, finalY + 22, {
      align: "right",
    });

    // Add notes
    doc.setFontSize(10);

    doc.text(
      "Thank you for your business!:",
      pageWidth / 2 - 10,
      pageHeight - 12,
      { align: "center" },
    );
    doc.setFontSize(7);
    doc.text(
      `created on: ${format(invoiceDetails.date, "PPpp")}`,
      endX,
      pageHeight - 12,
      { align: "right" },
    );

    // Save the PDF
    doc.save(`invoice_${invoiceDetails.invoiceNumber}.pdf`);
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={createPdf}>
        <File />
        Create PDF
      </Button>
    </div>
  );
}
