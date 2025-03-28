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

export const companyInfo = {
  name: "Breidys' Tree Services",
  address: "123 Business Street, Suite 100",
  city: "San Francisco, CA 94103",
  phone: "(555) 123-4567",
};
