"use client";
import { AddItemDialog } from "@/components/AddItemToInvoice";
import CreatePdf from "@/components/CreatePdf";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { companyInfo, InvoiceItem } from "@/typing";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function InvoicePage() {
  // This would be a server component in a real app
  // For demo purposes, we'll structure it as if it were using client components

  // Company information (in a real app, this would come from your settings/database)
  const params = useParams();
  const { invoiceId } = params as { invoiceId: Id<"invoices"> };

  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const invoiceDetails = useQuery(api.invoices.getInvoice, { id: invoiceId });
  const invoiceItems = useQuery(api.items.getInvoiceItems, {
    invoiceId,
  });
  const addItem = useMutation(api.items.createInvoiceItem);

  const client = useQuery(api.clients.getClient, {
    id: invoiceDetails?.clientId!,
  });

  const onAddItem = async (item: InvoiceItem) => {
    try {
      await addItem({
        invoiceId: invoiceId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      });
      setIsAddItemDialogOpen(false);
      toast.success("Item added to invoice");
    } catch (error) {
      console.error(error);
    }
  };

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

  if (!invoiceDetails || !client) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-600 shadow-lg my-8 rounded-lg">
      {/* Header with company and client info */}
      <div className="flex justify-between mb-10">
        {/* Company Info */}
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 relative rounded-full overflow-hidden">
            <Image
              src={"/logo.png"}
              alt="Company Logo"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
              {companyInfo.name}
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              {companyInfo.address}
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              {companyInfo.city}
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              {companyInfo.phone}
            </p>
          </div>
        </div>

        {/* Client Info - This would be fetched from your API */}
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            Bill To:
          </h3>
          <p className="font-medium">Client Name: {client?.name}</p>
          <p className="text-gray-600 dark:text-slate-300">
            Client Address:{client?.address}
          </p>
          <p className="text-gray-600 dark:text-slate-300">
            Client Email: {client?.email}
          </p>
          <p className="text-gray-600 dark:text-slate-300">
            Client Phone: {client?.phone}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between mb-2">
          <div>
            <span className="font-semibold">Invoice Number: </span>
            <span>{invoiceDetails.invoiceNumber}</span>
          </div>
          <div>
            <span className="font-semibold">Date: </span>
            <span>{format(invoiceDetails.date, "PP")}</span>
          </div>
        </div>
        {invoiceDetails.dueDate && (
          <div className="flex justify-between">
            <div>
              <span className="font-semibold">Due Date: </span>
              <span>{invoiceDetails.dueDate}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between my-2 items-center">
        <CreatePdf
          client={client}
          invoiceDetails={invoiceDetails}
          invoiceItems={invoiceItems}
        />
        <Button variant="outline" onClick={() => setIsAddItemDialogOpen(true)}>
          Add Item to Invoice
        </Button>
      </div>

      {/* Invoice Items */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800">
            <th className="py-2 px-4 text-left font-semibold ">Description</th>
            <th className="py-2 px-4 text-right font-semibold ">Quantity</th>
            <th className="py-2 px-4 text-right font-semibold ">Rate</th>
            <th className="py-2 px-4 text-right font-semibold ">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems?.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-4 capitalize italic">
                {item.description}
              </td>
              <td className="py-3 px-4 text-right">{item.quantity}</td>
              <td className="py-3 px-4 text-right">${item.rate.toFixed(2)}</td>
              <td className="py-3 px-4 text-right">
                ${item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add Item Dialog */}

      {/* Invoice Summary */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Tax (8%):</span>
            <span>${invoiceDetails.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center ">
        <p>Thank you for your business!</p>
        <p className="mt-2 font-semibold">{companyInfo.name}</p>
      </div>
      <AddItemDialog
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        onAddItem={onAddItem}
      />
    </div>
  );
}
