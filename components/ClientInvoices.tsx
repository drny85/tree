import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Invoice } from "@/typing";
import { format } from "date-fns";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

type Props = {
  invoices: Invoice[];
};

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(row.getValue("date"), "PP"),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${row.getValue("total")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="flex items-center space-x-2 justify-center">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "paid"
                ? "bg-green-500"
                : status === "pending"
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

function ClientInvoices({ invoices }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [search, setSearch] = useState("");
  const table = useReactTable({
    data: invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  if (invoices.length === 0) {
    return (
      <div className="flex p-4 justify-center items-center flex-1">
        <h2 className="text-2xl"> No invoices found</h2>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table className="w-full mb-8">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ClientInvoices;

const Actions = ({ invoice }: { invoice: Invoice }) => {
  const deleteInvoice = useMutation(api.invoices.deleteInvoice);
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/protected/invoice/${invoice._id}`}>
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
