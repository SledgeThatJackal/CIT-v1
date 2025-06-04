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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClerkProvider
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/sign-in"
      >
        <html lang="en">
          <body className="antialiased">
            <SettingsProvider settings={settings}>{children}</SettingsProvider>
            <Toaster richColors expand />
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
