import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./betterAuth/auth";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (context, args) => {
    const data = await context.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();
    return data;
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (context, args) => {
    const user = await authComponent.safeGetAuthUser(context);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const { _id: userId, name: userName } = user as {
      _id: string;
      name: string;
    };

    return await context.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: userId,
      authorName: userName,
    });
  },
});
