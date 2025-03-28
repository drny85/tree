import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input-field";
// Define the schema using zod
const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
  rate: z.number().min(1, "Rate must be non-negative"),
});

type AddItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }) => void;
};

export function AddItemDialog({
  open,
  onOpenChange,
  onAddItem,
}: AddItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      description: "",
      quantity: 1,
    },
  });

  const handleAddItem = (data: {
    description: string;
    quantity: number;
    rate: number;
  }) => {
    const amount = data.quantity * data.rate;
    onAddItem({ ...data, amount });
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Add Item to Invoice
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAddItem)} className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Input
              placeholder="Description"
              {...register("description")}
              className="w-full border capitalize border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>
          <div className="gap-1">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <Input
              type="number"
              placeholder="Quantity"
              {...register("quantity", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.quantity && (
              <p className="text-red-600 mt-1">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <CurrencyInput
              id="amount"
              placeholder="Price"
              decimalsLimit={2}
              // value={rate}
              prefix="$"
              onValueChange={(value, name) => {
                setValue("rate", Number(value));
                console.log(value, name);
              }}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.rate && (
              <p className="text-red-600 mt-1">{errors.rate.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="default"
              type="submit"
              className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
            >
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
