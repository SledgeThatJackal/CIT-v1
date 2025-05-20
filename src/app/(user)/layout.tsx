import ActiveLink from "@/components/ActiveLink";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

export default function UserLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
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
            <ActiveLink href="/">Home</ActiveLink>
            <ActiveLink href="/container">Containers</ActiveLink>
            <ActiveLink href="/item">Items</ActiveLink>
            <ActiveLink href="/tag">Tags</ActiveLink>
            <ActiveLink href="/type">Types</ActiveLink>
            <ActiveLink href="/settings">Settings</ActiveLink>
            <ActiveLink href="/find">Find</ActiveLink>
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
            <Button className="self-center" asChild>
              <SignInButton />
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}
