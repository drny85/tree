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
  _id: string;
  _creationTime: number;
  invoiceNumber: number;
  status: "draft" | "sent" | "paid";
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
};
