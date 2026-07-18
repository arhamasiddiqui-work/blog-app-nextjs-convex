"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { Menu } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ThemeToggle } from "./theme-toggle";
import { SearchInput } from "./SearchInput";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
        },
        onError: (err: Error) => {
          toast.error(err.message);
        },
      },
    });
  };

  return (
    <nav className="w-full border-b px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-3xl font-bold tracking-tight">
              Arha<span className="text-violet-700">.</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost" })}
            >
              Home
            </Link>

            <Link
              href="/blog"
              className={buttonVariants({ variant: "ghost" })}
            >
              Blog
            </Link>

            <Link
              href="/create"
              className={buttonVariants({ variant: "ghost" })}
            >
              Create
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="mr-2">
            <SearchInput />
          </div>

          {isLoading ? null : isAuthenticated ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Link
                href="/auth/sign-up"
                className={buttonVariants()}
              >
                Sign up
              </Link>

              <Link
                href="/auth/login"
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Login
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-8 flex flex-col gap-3 px-4">
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "ghost"
                  })}
                >
                  Home
                </Link>

                <Link
                  href="/blog"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Blog
                </Link>

                <Link
                  href="/create"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Create
                </Link>

                <div className="py-2">
                  <SearchInput />
                </div>

                {isLoading ? null : isAuthenticated ? (
                  <Button onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-up"
                      className={buttonVariants()}
                    >
                      Sign up
                    </Link>

                    <Link
                      href="/auth/login"
                      className={buttonVariants({
                        variant: "secondary",
                      })}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}