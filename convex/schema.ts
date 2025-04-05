import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.

export const statusLitetal = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("paid"),
  v.literal("requested"),
);
export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.any()),
  }).index("byClerkUserId", ["clerkUserId"]),
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    clerkUserId: v.string(),
  }).index("by_clerkUserId", ["clerkUserId"]),
  items: defineTable({
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    rate: v.number(),
    amount: v.number(),
  }).index("by_invoiceId", ["invoiceId"]),
  invoices: defineTable({
    quoteId: v.optional(v.id("quotes")),
    clientId: v.id("clients"),
    clerkUserId: v.string(),
    invoiceNumber: v.optional(v.number()),
    discount: v.optional(v.number()),
    date: v.string(),
    status: statusLitetal,
    dueDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    tax: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_quoteId", ["quoteId"]),
  quotes: defineTable({
    clientId: v.optional(v.id("clients")),
    clerkUserId: v.optional(v.string()),
    date: v.string(),
    invoiceId: v.optional(v.id("invoices")),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    description: v.string(),
  })
    .index("by_invoiceId", ["invoiceId"])
    .index("by_clerkUserId", ["clerkUserId"]),
});
