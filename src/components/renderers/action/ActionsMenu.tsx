import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import { ReactNode } from "react";

export default function ActionsMenu({
  children,
  isVertical = false,
  className,
}: {
  children: ReactNode;
  isVertical?: boolean;
  className?: string;
}) {
  return (
    <div className="flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "hover:bg-accent-alternate rounded hover:cursor-pointer",
            className
          )}
        >
          {isVertical ? <EllipsisVertical /> : <Ellipsis />}
        </DropdownMenuTrigger>
        <DropdownMenuContent>{children}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
