import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    imageUrl: v.optional(v.string()),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
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
  }).index("by_invoice", ["invoiceId"]),
  invoices: defineTable({
    clientId: v.id("clients"),
    invoiceNumber: v.number(),
    date: v.string(),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    dueDate: v.optional(v.string()),
    tax: v.number(),
  }).index("by_client", ["clientId"]),
});
