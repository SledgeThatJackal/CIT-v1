import { Suspense } from "react";

import {
  SignedOut as OriginalSignedOut,
  SignedIn as OriginalSignedIn,
} from "@clerk/nextjs";

export function SignedOut({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <OriginalSignedOut>{children}</OriginalSignedOut>
    </Suspense>
  );
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <OriginalSignedIn>{children}</OriginalSignedIn>
    </Suspense>
  );
}
