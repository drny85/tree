import { ClientsTable } from "@/components/ClientsTable";
import React from "react";

function page() {
  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <ClientsTable />
    </main>
  );
}

export default page;
