import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeletePostButton } from "@/components/web/DeletePostButton";

interface PostIdRouteProps {
  params: Promise<{ postId: Id<"posts"> }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchAuthQuery(api.posts.getPostById, { postId: postId });
  if (!post) {
    return {
      title: "Post not found",
    };
  }
  return {
    title: post.title,
    description: post.body,
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchAuthQuery(api.posts.getPostById, { postId: postId }),
    await preloadAuthQuery(api.comments.getCommentsByPostId, {
      postId: postId,
    }),
    await fetchAuthQuery(api.presence.getUserId),
  ]);

  if (!userId) {
    return redirect("/auth/login");
  }

  if (!post) {
    return (
      <div>
        <p className="text-6xl font-extrabold text-red-600 py-20">
          No post found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in py-8 px-4 duration-500 relative">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to blog
      </Link>
      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.imageUrl ?? "/futuremoon-cars-8891625.jpg"}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Posted on: {new Date(post._creationTime).toLocaleDateString()}
          </p>
          <PostPresence roomId={post._id} userId={userId} />
        </div>
      </div>

      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-foreground/90">{post.body}</p>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />

      {post.authorId === userId && (
        <div className="mt-3 w flex justify-end">
          <DeletePostButton postId={post._id} />
        </div>
      )}
    </div>
  );
}
