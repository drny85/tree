import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.id);
    return invoice;
  },
});

export const createInvoice = mutation({
  args: {
    invoiceNumber: v.number(),
    clientId: v.id("clients"),
    date: v.string(),
    dueDate: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    tax: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", args);
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
export const updateInvoice = mutation({
  args: {
    id: v.id("invoices"),
    invoiceNumber: v.number(),
    clientId: v.id("clients"),
    date: v.string(),
    dueDate: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    tax: v.number(),
  },
  handler: async (ctx, args) => {
    const existingInvoice = await ctx.db.get(args.id);
    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }
    return await ctx.db.patch(args.id, {
      invoiceNumber: args.invoiceNumber,
      clientId: args.clientId,
      date: args.date,
      dueDate: args.dueDate,
      status: args.status,
      tax: args.tax,
    });
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoiceItems = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("invoiceId"), args.id))
      .collect();
    for (const item of invoiceItems) {
      await ctx.db.delete(item._id);
    }
    await ctx.db.delete(args.id);
  },
});
