import { User } from "lucide-react";
import { AddClientForm } from "./AddClientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useClientStore } from "@/stores/useClientStore";

// Update your existing AddClientForm to include these props:
interface AddClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClient({ open, onOpenChange }: AddClientFormProps) {
  // ... existing code ...

  // Add this inside your onSubmit success handler:
  // onOpenChange(false);
  const { setSelectedClient, selectedClient } = useClientStore();
  const handleClose = () => {
    onOpenChange(false);
    setSelectedClient(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="flex">
          <DialogTitle>
            <div className="flex items-center gap-2">
              <User size={30} />
              <span>
                {selectedClient ? "Editing Client" : "Adding New Client"}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <AddClientForm onOpenChange={onOpenChange} open={open} />
      </DialogContent>
    </Dialog>
  );
}
