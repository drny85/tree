import { ClientsTable } from "@/components/ClientsTable";
import React from "react";

function page() {
  return (
    <main className="container mx-auto py-12 px-4">
      <ClientsTable />
    </main>
  );
}

export default page;
