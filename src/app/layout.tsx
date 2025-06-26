import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/features/settings/hooks/useSettings";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "CIT",
  description: "Spatial Organizational App",
};

type Props = {
  readonly children: React.ReactNode;
};

export default async function RootLayout(props: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClerkProvider
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/sign-in"
      >
        <html lang="en">
          <body className="antialiased">
            <SuspendedPage {...props} />
            <Toaster richColors expand />
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}

async function SuspendedPage({ children }: Props) {
  const settings = await getSettings();

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
}
