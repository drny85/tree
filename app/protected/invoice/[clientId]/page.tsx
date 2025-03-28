"use client";
import { AddItemDialog } from "@/components/AddItemToInvoice";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InvoiceItem } from "@/typing";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const companyInfo = {
  name: "Breidys' Tree Services",
  address: "123 Business Street, Suite 100",
  city: "San Francisco, CA 94103",
  phone: "(555) 123-4567",
  email: "contact@yourcompany.com",
  website: "www.yourcompany.com",
  logo: "/logo.png", // Place your logo in the public directory
};

const invoiceDetails = {
  invoiceNumber: "INV-2023-001",
  date: new Date().toLocaleDateString(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  items: [
    { description: "Service A", quantity: 1, rate: 100, amount: 100 },
    { description: "Service B", quantity: 2, rate: 75, amount: 150 },
    { description: "Service C", quantity: 3, rate: 50, amount: 150 },
  ],
  subtotal: 400,
  tax: 32,
  total: 432,
};

export default function InvoicePage() {
  // This would be a server component in a real app
  // For demo purposes, we'll structure it as if it were using client components

  // Company information (in a real app, this would come from your settings/database)

  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState(invoiceDetails.items);
  console.log(invoiceItems);
  const createInvoice = useMutation(api.invoices.createOrUpdateInvoice);

  const handleAddItem = (item: InvoiceItem) => {
    setInvoiceItems([...invoiceItems, item]);
  };

  // Invoice details (would normally come from your database)

  const params = useParams();
  const { clientId } = params as { clientId: Id<"clients"> };
  const client = useQuery(api.clients.getClient, { id: clientId });

  useEffect(() => {}, [client]);
  if (!client) {
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
              src={companyInfo.logo}
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
            <span>{invoiceDetails.date}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="font-semibold">Due Date: </span>
            <span>{invoiceDetails.dueDate}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
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
          {invoiceDetails.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-4">{item.description}</td>
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
            <span>${invoiceDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Tax (8%):</span>
            <span>${invoiceDetails.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
            <span>Total:</span>
            <span>${invoiceDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center ">
        <p>Thank you for your business!</p>
        <p className="mt-2">
          {companyInfo.website} | {companyInfo.email}
        </p>
      </div>
      <AddItemDialog
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        onAddItem={handleAddItem}
      />
    </div>
  );
}
