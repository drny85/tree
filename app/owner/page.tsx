"use client";
import { AddClient } from "@/components/AddClient";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DataTable } from "@/components/earnings/data-table";
import { EditClientDialog } from "@/components/EditClientForm";
import { createClientColumns } from "@/components/tables";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useClientStore } from "@/stores/useClientStore";
import { useMutation, useQuery } from "convex/react";
import { User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function Page() {
  const clients = useQuery(api.clients.getClients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { selectedClient: client } = useClientStore();
  const deleteClient = useMutation(api.clients.deleteClient);
  const [itemToDelete, setItemToDelete] = useState<Doc<"clients"> | null>();

  const handleDelete = async (client: Doc<"clients">) => {
    setItemToDelete(client);
  };
  const columns = createClientColumns({
    onDelete: handleDelete,
  });

  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <div className="flex justify-end mb-2 md:mb-0">
        <Button variant="default" onClick={() => setIsAddDialogOpen(true)}>
          <User size={36} />
          Add Client
        </Button>
      </div>
      <DataTable columns={columns} data={clients || []} />

      <AddClient open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      {client && <EditClientDialog client={client} />}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={() => {
          if (itemToDelete) {
            deleteClient({ id: itemToDelete._id });
            toast.success("Item deleted successfully");
            setItemToDelete(null);
          }
        }}
      />
    </main>
  );
}

export default Page;
