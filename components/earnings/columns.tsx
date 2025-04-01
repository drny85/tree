"use client";

import { formatDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";

export type TableInvoice = {
  amount: number;
  status: string;
  date: string;
  name: string;
};

export const columns: ColumnDef<TableInvoice>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("name")}</div>;
    },
  },
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
                ? "text-slate-600"
                : "text-blue-600"
          }`}
        >
          {status}
        </div>
      );
    },
  },
];
