import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/features/settings/hooks/useSettings";
import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { getSettings } from "@/lib/settings";
import { ClerkProvider } from "@/services/clerk/components/ClerkProvider";

export const metadata: Metadata = {
  title: "CIT",
  description: "Spatial Organizational App",
};

type Props = {
  readonly children: React.ReactNode;
};

export default async function RootLayout(props: Props) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <Suspense>
            <SuspendedPage {...props} />
          </Suspense>
          <Toaster richColors expand />
        </body>
      </html>
    </ClerkProvider>
  );
}

async function SuspendedPage({ children }: Props) {
  const settings = await getSettings();

  return <SettingsProvider settings={settings}>{children}</SettingsProvider>;
}
