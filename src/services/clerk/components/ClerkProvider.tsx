"use client";

import { Suspense } from "react";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <OriginalClerkProvider appearance={{ baseTheme: [dark] }}>
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
}
