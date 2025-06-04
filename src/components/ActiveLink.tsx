"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ActiveLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathName = usePathname();
  const isActive = href === "/" ? pathName === href : pathName.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-accent flex items-center px-2",
        className,
        isActive && "underline"
      )}
    >
      {children}
    </Link>
  );
}
