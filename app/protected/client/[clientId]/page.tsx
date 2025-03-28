"use client";
import ClientInvoices from "@/components/ClientInvoices";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { notFound, useParams, useRouter } from "next/navigation";

export default function ClientPage() {
  const params = useParams();
  const { clientId } = params as { clientId: Id<"clients"> };
  const router = useRouter();
  const client = useQuery(api.clients.getClient, { id: clientId });
  const invoices = useQuery(api.invoices.getClientInvoices, { clientId });
  const createInvoice = useMutation(api.invoices.createOrUpdateInvoice);

  const onCreateInvoice = async () => {
    // TODO: Implement this
    try {
      if (!client || !invoices) return;
      const invoice = await createInvoice({
        invoiceNumber: invoices.length + 1 || 0,
        clientId: client?._id,
        status: "draft",
        date: new Date().toISOString(),
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      });
      console.log("IB", invoice);
      if (invoice) {
        router.push(`/protected/invoice/${invoice}`);
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
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-black/50 shadow-lg my-8 rounded-lg">
      {/* Client Info */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
        <p className="text-gray-600">
          {client.address || "No address provided"}
        </p>
        <p className="text-gray-600">{client.email || "No email provided"}</p>
        <p className="text-gray-600">{client.phone}</p>
      </div>
      <div className="self-end flex justify-end">
        <Button variant="outline" size="lg" onClick={onCreateInvoice}>
          New Invoice
        </Button>
      </div>
      <ClientInvoices invoices={invoices} />
      {/* Search Input */}

      {/* List of Invoices */}
    </div>
  );
}
