"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "../ui/sidebar";

export function NavbarClient({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <div className="w-full flex flex-col">
        <div className="flex gap-1 items-center p-2 border-b">
          <SidebarTrigger />
          <span className="text-lg">CIT</span>
        </div>
        <div className="flex flex-1">{children}</div>
      </div>
    );

  return children;
}
