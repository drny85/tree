import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Invoice } from "@/typing";
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
import { useMutation } from "convex/react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Props = {
  invoices: Invoice[];
};

function ClientInvoices({ invoices }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [search, setSearch] = useState("");
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "#",
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) => format(row.getValue("date"), "PP"),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.getValue("status");
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
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300",
                  )}
                >
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
