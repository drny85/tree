import { Client, companyInfo, Invoice, InvoiceItem } from "@/typing";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import "jspdf-autotable";
import { useMemo } from "react";
import { Button } from "./ui/button";

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
    return invoiceItems.reduce((acc, item) => acc + item.amount, 0);
  }, [invoiceItems]);
  const total = useMemo(() => {
    if (!invoiceItems) return 0;
    return invoiceItems.reduce(
      (acc, item) => (acc + item.amount) * item.quantity,
      0,
    );
  }, [invoiceItems]);

  function renderInfo(
    doc: jsPDF,
    info: Record<string, string>,
    startX: number,
    startY: number,
  ) {
    doc.setFontSize(12);
    let yOffset = startY;
    Object.entries(info).forEach(([key, value]) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      doc.text(`${capitalizedKey}: ${value}`, startX, yOffset);
      yOffset += 8; // Adjust the spacing between lines
    });
  }
  const createPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const startX = pageWidth * 0.1;
    const endX = pageWidth - pageWidth * 0.25;
    // Add invoice information horizontally
    // Add invoice information
    doc.setFontSize(16);

    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceDetails.invoiceNumber}`, startX, 20); // Centered in the second section
    doc.text(`Date: ${format(invoiceDetails.date, "PP")}`, endX, 20); // Centered in the third section

    // Add company information on the left
    renderInfo(doc, companyInfo, startX, 40);
    // doc.setFontSize(18);
    // doc.text(companyInfo.name, startX, 40);
    // doc.setFontSize(12);
    // doc.text(`Address: ${companyInfo.address}`, startX, 50);
    // doc.text(`City: ${companyInfo.city}`, startX, 60);
    // doc.text(`Phone: ${companyInfo.phone}`, startX, 70);
    // doc.text(`Email: ${companyInfo.email}`, startX, 80);

    // Add client information on the right
    const clientInfoX = 120; // Adjust this value to position client info
    doc.text("Bill To:", clientInfoX, 40);
    doc.text(`Client Name: ${client?.name}`, clientInfoX, 48);
    doc.text(`Client Address: ${client?.address}`, clientInfoX, 56);
    doc.text(`Client Email: ${client?.email}`, clientInfoX, 62);
    doc.text(`Client Phone: ${client?.phone}`, clientInfoX, 70);

    // Add items table
    autoTable(doc, {
      startY: 100,
      headStyles: { fillColor: [100, 100, 100] },
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
    });

    // Add totals
    // Add totals
    const finalY = (doc as any).lastAutoTable?.finalY || 130;

    const rightAlignX = pageWidth - 30; // Adjust this value for padding

    doc.text(`Subtotal: $${subTotal.toFixed(2)}`, rightAlignX, finalY + 10, {
      align: "right",
    });
    doc.text(
      `Tax (8%): $${invoiceDetails.tax.toFixed(2)}`,
      rightAlignX,
      finalY + 20,
      { align: "right" },
    );
    doc.text(`Total: $${total.toFixed(2)}`, rightAlignX, finalY + 30, {
      align: "right",
    });

    // Save the PDF
    doc.save(`invoice_${invoiceDetails.invoiceNumber}.pdf`);
  };

  return (
    <div className="flex justify-end mb-4 space-x-2">
      <Button variant="outline" onClick={createPdf}>
        Create PDF
      </Button>
    </div>
  );
}
