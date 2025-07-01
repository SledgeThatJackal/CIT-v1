"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";

export default function NavbarGroup({
  items,
  className,
}: {
  items: {
    href: string;
    icon: React.ReactNode;
    label: string;
    total?: number;
  }[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => {
          const html = (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                  <span className="ml-auto text-muted-foreground text-[0.65rem]">
                    {item.total}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
