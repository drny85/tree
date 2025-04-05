import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const quotes = query({
  handler: async (ctx) => {
    const quotes = await ctx.db
      .query("quotes")

      .collect();
    return quotes;
  },
});

export const getQuote = query({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    const quote = await ctx.db.get(args.id);
    return quote;
  },
});

export const getQUoteByInvoiceId = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const quote = await ctx.db
      .query("quotes")
      .filter((q) => q.eq(q.field("invoiceId"), args.invoiceId))
      .collect();
    return quote;
  },
});

export const deleteQuote = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const createQuote = mutation({
  args: {
    clientId: v.optional(v.id("clients")),
    clerkUserId: v.optional(v.string()),
    date: v.string(),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const quote = await ctx.db.insert("quotes", args);
    return quote;
  },
});
