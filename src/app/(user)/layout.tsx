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
    <header className="flex h-12 shadow bg-background z-10 ml-3">
      <nav className="flex gap-4 container">
        <Suspense>
          <SignedIn>
            <Link
              href="/"
              className="mr-auto text-lg hover:underline flex items-center"
            >
              CIT
            </Link>
            <Link href="/" className="hover:bg-accent flex items-center px-2">
              Home
            </Link>
            <Link
              href="/container"
              className="hover:bg-accent flex items-center px-2"
            >
              Containers
            </Link>
            <Link
              href="/item"
              className="hover:bg-accent flex items-center px-2"
            >
              Items
            </Link>
            <Link
              href="/tag"
              className="hover:bg-accent flex items-center px-2"
            >
              Tags
            </Link>
            <Link
              href="/type"
              className="hover:bg-accent flex items-center px-2"
            >
              Types
            </Link>
            <Link
              href="/settings"
              className="hover:bg-accent flex items-center px-2"
            >
              Settings
            </Link>
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
