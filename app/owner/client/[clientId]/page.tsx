"use client";
import { DataTable } from "@/components/earnings/data-table";
import { invoicesColumns } from "@/components/tables";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatPhone } from "@/lib/formatPhone";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { notFound, useParams, useRouter } from "next/navigation";

export default function ClientPage() {
  const { userId } = useAuth();
  const params = useParams();
  const { clientId } = params as { clientId: Id<"clients"> };
  const router = useRouter();
  const client = useQuery(api.clients.getClient, { id: clientId });
  const invoices = useQuery(api.invoices.getClientInvoices, { clientId });
  const createInvoice = useMutation(api.invoices.createInvoice);

  const onCreateInvoice = async () => {
    // TODO: Implement this
    try {
      if (!client || !invoices || !userId) return;
      const invoice = await createInvoice({
        discount: 0,
        clerkUserId: userId,
        clientId: client._id,
        status: "draft",
        date: new Date().toISOString(),
        tax: 0,
      });

      if (invoice) {
        router.push(`/owner/invoice/${invoice}/${clientId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (client === undefined || invoices === undefined) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (client === null) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-black/50 shadow-lg my-8 rounded-lg">
      {/* Client Info */}
      <div className="mb-10 p-2">
        <h2 className="text-2xl font-bold  capitalize">Name: {client.name}</h2>
        <p className="text-gray-600 capitalize dark:text-slate-300">
          Address: {client.address || "No address provided"}
        </p>

        <p className="text-gray-600 dark:text-slate-300">
          Phone: {formatPhone(client.phone)}
        </p>
        <p className="text-gray-600 dark:text-slate-300">
          Email: {client.email || "No email provided"}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <p className="font-medium">Invoices Total:</p>
          <p>{invoices.length}</p>
        </div>
        <Button
          className="mb-2 md:mb-0 bg-green-600 hover:bg-green-700 text-white hover:text-white hover:cursor-pointer"
          variant="outline"
          size="lg"
          onClick={onCreateInvoice}
        >
          New Invoice
        </Button>
      </div>
      {/* <ClientInvoices invoices={invoices} /> */}
      <DataTable data={invoices} columns={invoicesColumns} />
      {/* Search Input */}

      {/* List of Invoices */}
    </div>
  );
}
