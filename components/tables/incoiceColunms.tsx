"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Invoice } from "@/typing";
import { formatDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export const xcolumns: ColumnDef<Doc<"invoices">>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "#",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("invoiceNumber")}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center space-x-2 justify-center">
          <div
            className={`w-4 h-4 rounded-full ${
              status === "paid"
                ? "bg-green-500"
                : status === "sent"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
          <span className="capitalize">{`${row.getValue("status")}`}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return <Actions invoice={invoice} />;
    },
  },
];

const Actions = ({ invoice }: { invoice: Invoice }) => {
  const deleteInvoice = useMutation(api.invoices.deleteInvoice);
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/owner/invoice/${invoice._id}/${invoice.clientId}`}>
        <Button>View</Button>
      </Link>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (!invoice) return;
          if (invoice.status === "paid") {
            toast.error("Cannot delete paid invoice");
            return;
          }

          deleteInvoice({ id: invoice._id });
          toast.success("Invoice deleted");
        }}
      >
        Delete
      </Button>
    </div>
  );
};
