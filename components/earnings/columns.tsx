"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/utils/formatDate";
import { Invoice } from "@/typing";
import { Doc } from "@/convex/_generated/dataModel";

export type TableInvoice = {
  amount: number;
  status: string;
  date: string;
};

export const columns: ColumnDef<TableInvoice>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`capitalize ${
            status === "paid"
              ? "text-green-600"
              : status === "draff"
                ? "text-yellow-600"
                : "text-red-600"
          }`}
        >
          {status}
        </div>
      );
    },
  },
];
