"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { commentsSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "@/components/ui/separator";
import { fetchAuthQuery } from "@/lib/auth-server";

export function CommentSection(props:{
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>
}) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const data = usePreloadedQuery(props.preloadedComments);
  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentsSchema as any),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  async function OnSubmit(data: z.infer<typeof commentsSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create post");
      }
    });
  }

if(data===undefined){
  return <p>Loading...</p>
}


  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-lg font-semibold ">{data.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(OnSubmit)}
        >
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Share your thoughts"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <p>Loading...</p>
              </>
            ) : (
              <p>Comment</p>
            )}
          </Button>
        </form>

{data.length> 0 && <Separator/>}

        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="shrink-0 size-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
           <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm text-foreground/85 leading-relaxed">{comment.body}</p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
