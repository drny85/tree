"use client";
import { AddItemDialog } from "@/components/AddItemToInvoice";
import { StatusChangeDialog } from "@/components/ChangeStatus";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import CreatePdf from "@/components/CreatePdf";
import { EditItemDialog } from "@/components/EditIvoiceItem";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatPhone } from "@/lib/formatPhone";
import { cn } from "@/lib/utils";
import { companyInfo, InvoiceItem } from "@/typing";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

export default function InvoicePage({
  params,
}: {
  params: Promise<{ clientId: Id<"clients">; invoiceId: Id<"invoices"> }>;
}) {
  const { invoiceId, clientId } = use(params);

  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Doc<"items"> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Doc<"items"> | null>(null);
  const updateItem = useMutation(api.items.updateInvoiceItem);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const invoiceDetails = useQuery(api.invoices.getInvoice, { id: invoiceId });
  const invoiceItems = useQuery(api.items.getInvoiceItems, {
    invoiceId,
  });
  const addItem = useMutation(api.items.createInvoiceItem);
  const deleteItem = useMutation(api.items.deleteInvoiceItem);
  const updateInvoice = useMutation(api.invoices.updateInvoice);

  const client = useQuery(api.clients.getClient, {
    id: clientId,
  });

  const handleDialogChange = (open: boolean) => {
    setIsEditItemDialogOpen(open);
    if (!open) {
      setSelectedItem(null);
    }
  };

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

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const handleStatusChange = async (status: Doc<"invoices">["status"]) => {
    await updateInvoice({
      id: invoiceId,
      clientId: invoiceDetails?.clientId!,
      date: invoiceDetails?.date!,
      status,
      invoiceNumber: invoiceDetails?.invoiceNumber!,
      tax: invoiceDetails?.tax!,
    });
    // You can add logic here to update the status in your database
    toast.success(`Invoice status changed to ${status}`);
  };

  const onEditItem = async (item: Doc<"items">) => {
    try {
      if (!selectedItem) return;

      if (!item) return;
      await updateItem({
        id: item._id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      });

      setIsEditItemDialogOpen(false);
      toast.success("Item updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    }
  };

  const subTotal = useMemo(() => {
    if (!invoiceItems) return 0;
    return invoiceItems.reduce(
      (acc, item) => acc + item.rate * item.quantity,
      0,
    );
  }, [invoiceItems]);
  const total = useMemo(() => {
    if (!invoiceItems) return 0;
    return invoiceItems.reduce(
      (acc, item) => acc + item.rate * item.quantity,
      0,
    );
  }, [invoiceItems]);

  if (!invoiceDetails || !client) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-slate-600 shadow-lg my-8 rounded-lg container w-full">
      {/* Header with company and client info */}
      <div className="flex md:justify-between mb-10 flex-col items-center md:flex-row">
        {/* Company Info */}
        <div className="flex items-center space-x-4">
          <div className="w-40 h-40 relative rounded-full overflow-hidden">
            <Image
              src={"/main-logo.png"}
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
              {companyInfo.city}
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              {companyInfo.phone}
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              {companyInfo.email}
            </p>
          </div>
        </div>

        {/* Client Info - This would be fetched from your API */}
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            Client:
          </h3>
          <p className="font-medium text-xl capitalize">Name: {client?.name}</p>
          <p className="text-gray-600 dark:text-slate-300 capitalize">
            Address:{client?.address}
          </p>
          <p className="text-gray-600 dark:text-slate-300">
            Email: {client?.email}
          </p>
          <p className="text-gray-600 dark:text-slate-300">
            Phone: {formatPhone(client?.phone)}
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
            <span className="font-semibold">Staus: </span>
            <span className="capitalize">{invoiceDetails.status}</span>
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

      <div className="flex justify-between  mb-2 items-center">
        {invoiceItems && invoiceItems?.length > 0 && (
          <CreatePdf
            client={client}
            invoiceDetails={invoiceDetails}
            invoiceItems={invoiceItems}
          />
        )}
        {invoiceItems && invoiceItems.length > 0 && (
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            Change Status
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setIsAddItemDialogOpen(true)}
          className={cn({
            "ml-auto": !invoiceItems || invoiceItems.length === 0,
          })}
        >
          Add Item to Invoice
        </Button>
      </div>

      {/* Invoice Items */}
      {invoiceItems && invoiceItems.length > 0 && (
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="py-2 px-4 text-left font-semibold ">
                Description
              </th>
              <th className="py-2 px-4 text-right font-semibold ">Quantity</th>
              <th className="py-2 px-4 text-right font-semibold ">Rate</th>
              <th className="py-2 px-4 text-right font-semibold ">Amount</th>
              <th className="py-2 px-4 text-right font-semibold "></th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 capitalize italic">
                  {item.description}
                </td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-right">
                  ${item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  ${item.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Button
                    variant={"ghost"}
                    className="hidden md:table-cell"
                    onClick={() => {
                      setItemToDelete(item);
                    }}
                  >
                    <Trash color="orange" />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditItemDialogOpen(true);
                    }}
                  >
                    <Edit />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add Item Dialog */}

      {/* Invoice Summary */}
      {invoiceItems && invoiceItems.length > 0 && (
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
      )}

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

      {selectedItem && (
        <EditItemDialog
          open={isEditItemDialogOpen}
          onOpenChange={handleDialogChange}
          onEditItem={onEditItem}
          item={selectedItem}
        />
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={() => {
          if (itemToDelete) {
            deleteItem({ id: itemToDelete._id });
            toast.success("Item deleted successfully");
            setItemToDelete(null);
          }
        }}
      />

      <StatusChangeDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onChangeStatus={handleStatusChange}
        currentStatus={invoiceDetails.status}
      />
    </div>
  );
}
