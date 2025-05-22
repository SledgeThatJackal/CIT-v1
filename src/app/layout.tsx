import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/features/settings/hooks/useSettings";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "CIT",
  description: "Spatial Organizational App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings: {
    id: string;
    key: string;
    value: string;
  }[] = [];

  if (typeof window !== "undefined") {
    const { getSettings } = await import("@/lib/settings");

    settings = await getSettings();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClerkProvider>
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
