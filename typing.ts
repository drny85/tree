import { Id } from "./convex/_generated/dataModel";

export type Client = {
  _id: string;
  _creationTime: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
};

export type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type Invoice = {
  _id: Id<"invoices">;
  _creationTime: number;
  invoiceNumber: number;
  status: "draft" | "sent" | "paid";
  date: string;
  dueDate?: string;
  tax: number;
};
