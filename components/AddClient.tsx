import { User } from "lucide-react";
import { AddClientForm } from "./AddClientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Update your existing AddClientForm to include these props:
interface AddClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClient({ open, onOpenChange }: AddClientFormProps) {
  // ... existing code ...

  // Add this inside your onSubmit success handler:
  // onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex">
          <DialogTitle>
            <div className="flex items-center gap-2">
              <User size={30} />
              Add New Client
            </div>
          </DialogTitle>
        </DialogHeader>
        <AddClientForm onOpenChange={onOpenChange} open={open} />
      </DialogContent>
    </Dialog>
  );
}
