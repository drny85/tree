import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { current, getCurrentUser, userByClerkUserId } from "./users";

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
    if (!user) {
      throw new Error("Not authenticated");
    }
    await ctx.db.insert("clients", { ...args, clerkUserId: user.clerkUserId });
  },
});

export const getClient = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
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
    await ctx.db.delete(args.id);
  },
});
