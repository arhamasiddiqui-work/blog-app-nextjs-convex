import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function SearchInput() {
  const [getTerm, setTerm] = useState("");
  const [getOpen, setOpen] = useState(false);

  const results = useQuery(
    api.posts.searchPost,
    getTerm.length >= 2
      ? {
          limit: 5,
          term: getTerm,
        }
      : "skip",
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }

  return (
    <div className="relative w-full max-w-sm z-100">
      <div className="relative">
        <Search className="absolute w-4 h-4 top-2.5 left-2.5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Posts..."
          className=" pl-8 bg-background focus-visible:border-violet-500
         focus-visible:ring-violet-500/40"
          value={getTerm}
          onChange={handleInputChange}
        />
      </div>
      {getOpen && getTerm.length >= 2 && (
        <div className="absolute top-full mt-2 rounded-md border w-full bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            <div className="flex items-center justify-between p-4 text-sm text-muted-foreground">
              <Loader2 className="w-h h-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              No results found!
            </p>
          ) : (
            <div className="py-1">
              {results.map((post) => (
                <Link
                  href={`/blog/${post._id}`}
                  key={post._id}
                  onClick={() => {
                    setOpen(false);
                    setTerm("");
                  }}
                  className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground pt-1">
                    {post.body.substring(0, 35)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
