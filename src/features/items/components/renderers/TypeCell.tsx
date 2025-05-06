import { LoadingSwap } from "@/components/ActionAlertDialog";
import ReadCell from "@/components/renderers/ReadCell";
import TemplateCell from "@/components/renderers/TemplateCell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypes } from "@/features/types/hooks/useTypes";
import { showPromiseToast } from "@/util/Toasts";
import { CellContext } from "@tanstack/react-table";
import React, { useRef, useState, useTransition } from "react";
import { updateItemType } from "../../actions/item";
import { ItemType } from "../../schema/item";

export default function TypeCell({
  getValue,
  row,
}: CellContext<ItemType, { id: string; name: string } | undefined>) {
  const type = getValue();
  return (
    <TemplateCell>
      <ReadView type={type} />
      <WriteView type={type} itemId={row.original.id} />
    </TemplateCell>
  );
}

function ReadView({
  type,
  toggleWriting,
}: {
  type: { id: string; name: string } | undefined;
  toggleWriting?: () => void;
}) {
  // This should never be entered
  if (!toggleWriting) throw new Error("Visibility function not provided");

  return (
    <ReadCell
      value={type?.name}
      title="Double click to edit"
      func={toggleWriting}
    />
  );
}

function WriteView({
  itemId,
  type,
  toggleReading,
}: {
  itemId: string;
  type: { id: string; name: string } | undefined;
  toggleReading?: () => void;
}) {
  const [isLoading, startTransition] = useTransition();
  const [value, setValue] = useState(type?.id ?? "");
  const alertButton = useRef<HTMLButtonElement>(null);

  function handleChange(newValue: string) {
    setValue(newValue);
    alertButton.current?.click();
  }

  function performAction(
    action: () => Promise<Error | { message: string }>,
    loading: string
  ) {
    startTransition(async () => {
      showPromiseToast(action, loading, toggleReading);
    });
  }

  const types = useTypes();

  function handleClick() {
    const action = updateItemType.bind(null, itemId);

    return performAction(() => action(value), "Attempting to updated type");
  }

  return (
    <React.Fragment>
      <Select defaultValue={type?.id} onValueChange={handleChange}>
        <SelectTrigger className="hover:cursor-pointer" onBlur={toggleReading}>
          <SelectValue placeholder="Select a type..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {types &&
              types.length > 0 &&
              types.map((typeOption) => (
                <SelectItem
                  key={`select-${typeOption.id}`}
                  value={typeOption.id}
                >
                  {typeOption.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger ref={alertButton} className="hidden" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={toggleReading}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={handleClick}
              className="cursor-pointer"
            >
              <LoadingSwap isLoading={isLoading}>Yes</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
