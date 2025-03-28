import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInvoiceItems = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoiceItems = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("invoiceId"), args.invoiceId))
      .collect();
    return invoiceItems;
  },
});

export const createInvoiceItem = mutation({
  args: {
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    rate: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("items", args);
  },
});

export const updateInvoiceItem = mutation({
  args: {
    id: v.id("items"),
    description: v.string(),
    quantity: v.number(),
    rate: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args);
  },
});

export const deleteInvoiceItem = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
