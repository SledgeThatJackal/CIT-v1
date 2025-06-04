import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { CircleHelp } from "lucide-react";

export default function HelpToolTip({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleHelp className="text-yellow-500" size="1.2em" />
        </TooltipTrigger>
        <TooltipContent className="bg-table-header text-white">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
