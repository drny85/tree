import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInvoice = query({
  args: { invoiceNumber: v.string() },
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq("invoiceNumber", args.invoiceNumber))
      .first();
    return invoice;
  },
});

export const createOrUpdateInvoice = mutation({
  args: {
    invoiceNumber: v.number(),
    clientId: v.id("clients"),
    date: v.string(),
    dueDate: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
        amount: v.number(),
      }),
    ),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const existingInvoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("invoiceNumber"), args.invoiceNumber))
      .first();
    if (existingInvoice) {
      return await ctx.db.patch(existingInvoice._id, args);
    } else {
      return await ctx.db.insert("invoices", args);
    }
  },
});

export const getClientInvoices = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("clientId"), args.clientId))
      .order("desc")
      .collect();
    return invoices;
  },
});

export const addItemToInvoice = mutation({
  args: {
    invoiceNumber: v.string(),
    item: v.object({
      description: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq("invoiceNumber", args.invoiceNumber))
      .first();
    if (invoice) {
      await ctx.db.patch(invoice._id, {
        items: [...invoice.items, args.item],
      });
    }
  },
});
