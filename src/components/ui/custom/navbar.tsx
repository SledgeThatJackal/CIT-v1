import { appVersion } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { Button } from "../button";

export default function Navbar({ children }: { children: ReactNode }) {
  return (
    <header className="flex h-12 shadow bg-navbar-background z-10 pl-3 pr-3 border-0 border-b-2 border-accent-alternate">
      <nav className="flex gap-4 w-full">
        <Suspense>
          <SignedIn>
            <Link
              href="/"
              className="mr-auto text-lg hover:underline flex items-center"
            >
              CIT
            </Link>
            {children}
          </SignedIn>
          <div className="size-8 self-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
        </Suspense>
        <Suspense>
          <SignedOut>
            <Button
              className="self-center ms-auto hover:cursor-pointer"
              variant="secondary"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>
        </Suspense>
        <div className="text-center self-center text-xs">v{appVersion}</div>
      </nav>
    </header>
  );
}
