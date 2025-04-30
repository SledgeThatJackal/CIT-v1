"use client";

import { ActionDialog } from "@/components/ActionDialog";
import ActionsMenu from "@/components/renderers/action/ActionsMenu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React, { ReactNode, useRef, useState } from "react";
import DuplicateItem from "./DuplicateItem";
import { ItemType } from "../../schema/item";
import { CellContext } from "@tanstack/react-table";
import EditContainers from "./EditContainers";
import { ActionAlertDialog } from "@/components/ActionAlertDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteItem } from "../../actions/item";

export default function ActionsItemCell<S>({ row }: CellContext<ItemType, S>) {
  const [component, setComponent] = useState<ReactNode>(undefined);
  const alertButton = useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <ActionsMenu>
        <DropdownMenuItem>Details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setComponent(<DuplicateItem row={row} />)}
        >
          Duplicate Item
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setComponent(<EditContainers row={row} />)}
        >
          Edit Containers
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alertButton.current?.click()}>
          Delete Item
        </DropdownMenuItem>
      </ActionsMenu>
      <ActionDialog>{component}</ActionDialog>
      <ActionAlertDialog
        action={deleteItem.bind(null, row.original.id)}
        loading={`Attempting to delete item: ${row.original.name}`}
      >
        <AlertDialogTrigger ref={alertButton} className="hidden" />
      </ActionAlertDialog>
    </React.Fragment>
  );
}
