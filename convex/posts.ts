import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
import { Doc } from "./_generated/dataModel";

export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (context, args) => {
    const user = await authComponent.safeGetAuthUser(context);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const userId = (user as { _id: string })._id;
    console.log("Creating post for user:", userId);

    const blogArticle = await context.db.insert("posts", {
      title: args.title,
      body: args.body,
      authorId: userId,
      imageStorageId: args.imageStorageId,
    });
    return blogArticle;
  },
});

export const getPosts = query({
  args: {},
  handler: async (context) => {
    const posts = await context.db.query("posts").order("desc").collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolveImageUrl =
          post.imageStorageId !== undefined
            ? await context.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolveImageUrl,
        };
      }),
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (context) => {
    const user = await authComponent.safeGetAuthUser(context);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    return await context.storage.generateUploadUrl();
  },
});

export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (context, args) => {
    const post = await context.db.get(args.postId);

    if (!post) {
      return null;
    }

    const resolveImageUrl =
      post?.imageStorageId !== undefined
        ? await context.storage.getUrl(post.imageStorageId)
        : null;
    return {
      ...post,
      imageUrl: resolveImageUrl,
    };
  },
});

interface searchResultTypes {
  _id: string;
  title: string;
  body: string;
}

export const searchPost = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (context, args) => {
    const limit = args.limit;
    const result: Array<searchResultTypes> = [];
    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;
        seen.add(doc._id);
        result.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        });
        if (result.length >= limit) break;
      }
    };

    const titleMatches = await context.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(limit);

    await pushDocs(titleMatches);

    if (result.length < limit) {
      const bodyMatches = await context.db
        .query("posts")
        .withSearchIndex("search_body", (q) => q.search("body", args.term))
        .take(limit);

      await pushDocs(bodyMatches);
    }

    return result;
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (context, args) => {
    const user = await authComponent.safeGetAuthUser(context);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const userId = (user as { _id: string })._id;

    const post = await context.db.get(args.postId);

    if (!post) {
      throw new ConvexError("Post not found");
    }
    if (post.imageStorageId) {
      await context.storage.delete(post.imageStorageId);
    }

    await context.db.delete(args.postId);

    console.log("userId:", userId);
    if (post.authorId !== userId) {
      throw new ConvexError("You can only delete your own posts.");
    }
  },
});
