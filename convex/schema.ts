import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  }),
  invoices: defineTable({
    clientId: v.id("clients"),
    invoiceNumber: v.number(),
    date: v.string(),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    dueDate: v.optional(v.string()),
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
  }).index("by_client", ["clientId"]),
});
