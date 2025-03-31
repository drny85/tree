import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyDiscount: (discount: number) => void;
  currentDiscount?: number;
}

export function DiscountDialog({
  open,
  onOpenChange,
  onApplyDiscount,
  currentDiscount = 0,
}: DiscountDialogProps) {
  const [discount, setDiscount] = useState(currentDiscount);

  const handleClose = () => {
    setDiscount(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={String(discount)}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min={0}
              autoFocus
              step={5}
              required
              max={100}
              placeholder="Enter discount percentage"
              className="flex-1"
            />
            <span>%</span>
          </div>
          <Button
            onClick={() => {
              onApplyDiscount(discount);
              onOpenChange(false);
            }}
            className="w-full"
          >
            Apply Discount
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
