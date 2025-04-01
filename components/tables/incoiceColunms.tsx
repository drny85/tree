"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useClientStore } from "@/stores/useClientStore";
import { Invoice } from "@/typing";
import { formatDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
interface ClientColumnActions {
  onDelete: (client: Doc<"clients">) => void;
}

export const createClientColumns = ({
  onDelete,
}: ClientColumnActions): ColumnDef<Doc<"clients">>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NAME
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground hidden md:table-cell">
        {row.getValue("email") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-muted-foreground hidden md:table-cell">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-muted-foreground capitalize hidden md:table-cell">
        {row.getValue("address") || "-"}
      </div>
    ),
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <div className="flex items-center gap-3 md:w-fit w-full justify-betweent px-10 md:px-4">
          <Link className="font-medium" href={`/owner/client/${client._id}`}>
            View
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal size={38} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  useClientStore.getState().setSelectedClient(client);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onDelete(client);
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
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
