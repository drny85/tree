import { Id } from "./convex/_generated/dataModel";

export type Client = {
  _id: Id<"clients">;
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
  clientId: Id<"clients">;
  invoiceNumber: number;
  status: "draft" | "sent" | "paid";
  date: string;
  dueDate?: string;
  tax: number;
  discount?: number;
};

export const companyInfo = {
  name: "Breidys' Tree Services",
  city: "Stroudsburg, PA 18360",
  phone: "(917) 238-5229",
  email: "breidysmelendez2@gmail.com",
};
