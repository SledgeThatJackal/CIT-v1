import { showPromiseToast } from "@/util/Toasts";
import { ReactNode, useState, useTransition } from "react";
import { LoadingSwap } from "./ActionAlertDialog";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function PopoverAction({
  action,
  loading,
  children,
}: {
  action: () => Promise<Error | { message: string }>;
  loading: string;
  children: ReactNode;
}) {
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  function performAction() {
    startTransition(async () => {
      showPromiseToast(action, loading);
      setIsOpen(false);
    });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Card>
          <CardHeader>
            <CardTitle>Are you sure?</CardTitle>
            <CardDescription>This Cannot be undone.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => setIsOpen(false)}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={performAction}
              className="ms-auto hover:cursor-pointer"
              variant="destructive"
            >
              <LoadingSwap isLoading={isLoading}>Delete</LoadingSwap>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
