import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { ReactNode } from "react";

export default function ActionsMenu({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-accent-alternate rounded">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>{children}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
