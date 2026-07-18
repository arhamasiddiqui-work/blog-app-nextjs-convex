import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// export const dynamic="force-static";
// export const revalidate=60;
// false | 0 | number
// 'auto' | 'force-cache' | 'force-static' | 'no-store'

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts and trends from our team!
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlog />
      </Suspense>
    </div>
  );
}

async function LoadBlog() {
  const data = await fetchAuthQuery(api.posts.getPosts);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="p-0">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.imageUrl ?? "/futuremoon-cars-8891625.jpg"}
              alt="image"
              fill
              className="object-cover"
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <p className="text-2xl hover:text-violet-600 transition-colors">
                {post.title}
              </p>
            </Link>
            <p className="text-muted-foreground ">{post.body}</p>
          </CardContent>
          <CardFooter>
            <Link
              href={`/blog/${post._id}`}
              className={buttonVariants({
                className:
                  "w-full bg-violet-700 text-white hover:bg-violet-900 transition-colors",
              })}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
