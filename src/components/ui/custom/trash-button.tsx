import { Trash2Icon } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TrashButton({ className, size = "sm", ...props }: any) {
  return (
    <Button
      variant="destructiveOutline"
      size={size}
      className={cn("ms-auto hover:cursor-pointer", className)}
      {...props}
    >
      <Trash2Icon />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
