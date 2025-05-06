import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ReadCell<T extends string | number | undefined>({
  value,
  title,
  className,
  func,
}: {
  value: T;
  title: string;
  className?: string;
  func: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={cn(!value && "w-full")}>
          <div
            className={cn(!value && "h-5", className ? className : "text-left")}
            onDoubleClick={func}
          >
            {value}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
