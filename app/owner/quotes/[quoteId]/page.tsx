"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { CalendarIcon, DollarSign, FileText, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

function QuoteDetails({
  params,
}: {
  params: Promise<{ quoteId: Id<"quotes"> }>;
}) {
  const { quoteId } = use(params);
  const quote = useQuery(api.quotes.getQuote, { id: quoteId });
  const deleteQuote = useMutation(api.quotes.deleteQuote);
  const createInvoice = useMutation(api.invoices.createInvoice);
  const createClient = useMutation(api.clients.createClient);

  const router = useRouter();

  if (!quote) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading quote details...
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const createInvoiceFromQuote = async () => {
    // Implement the logic to create a quote here
    try {
      const clientId = await createClient({
        name: quote.clientName || "",
        email: quote.clientEmail,
        phone: quote.clientPhone || "",
      });
      const invoice = await createInvoice({
        clerkUserId: quote.clerkUserId || "",
        date: new Date().toISOString(),
        clientId,
        notes: quote.description,
        tax: 0,
        status: "requested",
      });
      await deleteQuote({ id: quoteId });
      toast.success("Quote created successfully");
      router.push(`/owner/invoice/${invoice}/${clientId}`);
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-3xl font-bold">Quote Details</h1>
        <div className="space-x-2 flex">
          <div className="hidden md:flex">
            <Button
              variant="outline"
              onClick={() => router.push("/owner/quotes")}
            >
              Back to Quotes
            </Button>
          </div>
          <Button onClick={createInvoiceFromQuote}>
            Create Invoice From Quote
          </Button>
        </div>
      </div>

      <div>
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-2xl capitalize">
                  {quote.clientName}
                </CardTitle>
                <CardDescription>Quote #: {quote._id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  Client's Phone
                </h3>
                <div className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  <span>{quote.clientPhone}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  Client's Email
                </h3>
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  <span>{quote.clientEmail}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {quote.description || "No description provided."}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <DollarSign className="mr-2 h-5 w-5" /> Pricing Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(0)}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" /> Dates
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 w-32">
                      Created:
                    </span>
                    <span>{format(quote._creationTime, "PPpp")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QuoteDetails;
