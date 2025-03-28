import { v, Validator } from "convex/values";
import { internalMutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";

export const userByClerkUserId = async (ctx: QueryCtx, clerkUserId: string) => {
  return await ctx.db
    .query("users")
    .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
};

export const getCurrentUser = async (ctx: QueryCtx) => {
  const indetity = await ctx.auth.getUserIdentity();
  if (!indetity) return null;
  const user = await userByClerkUserId(ctx, indetity.subject);
  return user;
};

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await userByClerkUserId(ctx, clerkUserId);
    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn("Cant not delete user");
    }
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAtt = {
      email: data.email_addresses[0].email_address,
      clerkUserId: data.id,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
      imageUrl: data.image_url ?? undefined,
    };

    const user = await userByClerkUserId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAtt);
    } else {
      await ctx.db.patch(user._id, userAtt);
    }
  },
});
