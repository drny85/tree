"use client";
import { AddClient } from "@/components/AddClient";
import { DataTable } from "@/components/earnings/data-table";
import { EditClientDialog } from "@/components/EditClientForm";
import { createClientColumns } from "@/components/tables/incoiceColunms";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useClientStore } from "@/stores/useClientStore";
import { useMutation, useQuery } from "convex/react";
import { User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function page() {
  const clients = useQuery(api.clients.getClients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { selectedClient: client } = useClientStore();
  const deleteClient = useMutation(api.clients.deleteClient);

  const handleDelete = async (client: Doc<"clients">) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await deleteClient({ id: client._id });
      toast.success("Client deleted");
    }
  };
  const columns = createClientColumns({
    onDelete: handleDelete,
  });

  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <div className="flex justify-end">
        <Button variant="default" onClick={() => setIsAddDialogOpen(true)}>
          <User size={36} />
          Add Client
        </Button>
      </div>
      <DataTable columns={columns} data={clients || []} />

      <AddClient open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      {client && <EditClientDialog client={client} />}
    </main>
  );
}

export default page;
