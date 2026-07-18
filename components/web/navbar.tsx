"use client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router=useRouter();

  return (
    <nav className="w-full p-5 flex items-center justify-between">
      <div className="flex items-center gap-2 ">
        <Link href="/">
          <p className="text-3xl font-bold tracking-tight ">
            <span>Arha</span>
            <span className="text-violet-700">.</span>
          </p>
        </Link>

        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blog
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
      <div className="hidden md:block mr-2">
        <SearchInput/>
      </div>
        {isLoading ? null : isAuthenticated ? (
          <Button onClick={()=>authClient.signOut({
            fetchOptions:{
              onSuccess: ()=>{
                toast.success("Logged out successfully");
                  router.push("/");
              },
              onError:(err:Error)=>{
                toast.error(err.message);
              }
            }
          })}>Logout</Button>
        ) : (
          <>
            <Link className={buttonVariants()} href="/auth/sign-up">
              Sign up
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href="/auth/login">
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
  
}

