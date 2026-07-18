import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { Presence } from "@convex-dev/presence";
import { authComponent } from "./betterAuth/auth";

export const presence = new Presence(components.presence);

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("heartbeat called");

    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    return await presence.heartbeat(
      ctx,
      args.roomId,
      args.userId,
      args.sessionId,
      args.interval,
    );
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const entries = await presence.list(ctx, roomToken);
    return await Promise.all(
      entries.map(async (entry) => {
        const user: any = await authComponent.getAnyUserById(ctx, entry.userId);

        if (!user) {
          return entry;
        }
        return {
          ...entry,
          name: user.name,
        };
      }),
    );
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    return await presence.disconnect(ctx, sessionToken);
  },
});

export const getUserId = query({
  args: {},
  handler: async (context) => {
    const user: any = await authComponent.safeGetAuthUser(context);
    return user?._id;
  },
});
