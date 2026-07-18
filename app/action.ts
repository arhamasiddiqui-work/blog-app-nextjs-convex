"use server";

import { postSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function createBlogAction(formData: FormData) {
  try {
    const values = {
      title: formData.get("title"),
      content: formData.get("content"),
      image: formData.get("image"),
    };

    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("something went wrong");
    }

    const imageUrl = await fetchAuthMutation(
      api.posts.generateImageUploadUrl,
      {},
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchAuthMutation(api.posts.createPost, {
      body: parsed.data.content,
      title: parsed.data.title,
      imageStorageId: storageId,
    });
  } catch {
  return {
    error: "Failed to create post",
  };
}

  revalidatePath("/blog");
  return {
    success: true,
  };
}
