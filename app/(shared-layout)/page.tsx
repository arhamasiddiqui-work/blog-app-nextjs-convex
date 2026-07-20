import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="space-y-4 flex flex-col items-center">
        <div className="max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-violet-500 uppercase">
            Welcome to
          </p>

          <h1 className="bg-gradient-to-r from-white to-violet-500 bg-clip-text text-transparent text-6xl font-bold">Arhama
            <span className="text-violet-600 animate-pulse">~</span>
          </h1>

          <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
            Learning by building,
            <br />
            one project at a time.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            <span> Hi, I'm</span>
            &nbsp;
            <span className="font-semibold text-foreground text-xl">
              Arhama Siddiqui
            </span>
            &nbsp;
            <span>I built</span>
            &nbsp;
            <span className="font-medium text-xl">Arhama</span>
            &nbsp;
            <span>
              while learning modern web development. Every project helps me
              improve my skills & explore new ideas from blogs and e-commerce
              websites to dashboards and full-stack applications
            </span>
            .
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/blog">Explore Posts</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/create">Write a Post</Link>
          </Button>
        </div>
      </section>
      <section className="mt-28 border-t pt-20 text-center">
  <h2 className="text-3xl font-bold">Thanks for visiting💜</h2>

  <p className="mx-auto mt-5 max-w-xl leading-8 text-muted-foreground">
    This is one of the projects I've enjoyed building while learning web
    development. I hope you liked it. Make sure to check out my blog and my other projects too!
  </p>
</section>
    </main>
  );
}
