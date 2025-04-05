"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/earnings/data-table";
import { quotesColumns } from "@/components/tables";

export default function QuotesPage() {
  const quotes = useQuery(api.quotes.quotes);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quotes From Clients</h1>
      <DataTable data={quotes || []} columns={quotesColumns} />
    </div>
  );
}
