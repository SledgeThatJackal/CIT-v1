import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Separator } from "./ui/separator";

type TextSize = "xs" | "sm" | "lg" | "xl" | "2xl";

export function PageHeader({
  title,
  children,
  className,
  textSize = "2xl",
  separator = false,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
  textSize?: TextSize;
  separator?: boolean;
}) {
  return (
    <div className="mb-7 w-full">
      <div
        className={cn(
          "flex gap-4 items-center justify-between w-full",
          className
        )}
      >
        <div>
          <h1 className={`text-${textSize}`}>{title}</h1>
        </div>
        {children && <div>{children}</div>}
      </div>
      {separator && <Separator className="mt-2" />}
    </div>
  );
}
