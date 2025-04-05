import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getClients = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("clients")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", user.clerkUserId))
      .collect();
  },
});

export const createClient = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "owner") {
      throw new Error("Not authenticated");
    }
    const client = await ctx.db.insert("clients", {
      ...args,
      clerkUserId: user.clerkUserId,
    });

    return client;
  },
});

export const getClient = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "owner") {
      throw new Error("Not authenticated");
    }
    return await ctx.db.get(args.id);
  },
});

export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      notes: args.notes,
    });
  },
});

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "owner") {
      throw new Error("Not authenticated");
    }
    //detele client invoice items
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("clientId"), args.id))
      .collect();
    for (const invoice of invoices) {
      await ctx.db.delete(invoice._id);
      const items = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
        .collect();
      //delete invoice items
      for (const item of items) {
        await ctx.db.delete(item._id);
      }
    }

    //delete itemws

    //delete client quotes
    const quotes = await ctx.db
      .query("quotes")
      .filter((q) => q.eq(q.field("clientId"), args.id))
      .collect();
    for (const quote of quotes) {
      await ctx.db.delete(quote._id);
    }

    //delete client
    await ctx.db.delete(args.id);
  },
});
