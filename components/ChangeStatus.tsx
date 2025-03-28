import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (status: Doc<"invoices">["status"]) => void;
  currentStatus: Doc<"invoices">["status"];
};

export function StatusChangeDialog({
  open,
  onOpenChange,
  onChangeStatus,
  currentStatus,
}: Props) {
  const [selectedStatus, setSelectedStatus] =
    useState<Doc<"invoices">["status"]>(currentStatus);

  const handleSubmit = () => {
    onChangeStatus(selectedStatus);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Invoice Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedStatus}
            onValueChange={(e) =>
              setSelectedStatus(e as Doc<"invoices">["status"])
            }
          >
            <SelectTrigger className="w-full">
              <span>{selectedStatus}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="draff">Draff</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Change Status</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
