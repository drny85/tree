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
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <AddClientForm onOpenChange={onOpenChange} open={open} />
      </DialogContent>
    </Dialog>
  );
}
