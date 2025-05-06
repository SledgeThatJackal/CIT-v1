"use client";

import { ActionAlertDialog } from "@/components/ActionAlertDialog";
import { ActionDialog } from "@/components/ActionDialog";
import ActionsMenu from "@/components/renderers/action/ActionsMenu";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CellContext } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import React, { ReactNode, useRef, useState } from "react";
import { deleteItem } from "../../actions/item";
import { ItemType } from "../../schema/item";
import DuplicateItem from "./DuplicateItem";
import EditContainers from "./EditContainers";
import ItemForm from "../ItemForm";

export default function ActionsItemCell<S>({ row }: CellContext<ItemType, S>) {
  const [component, setComponent] = useState<ReactNode>(undefined);
  const alertButton = useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <ActionsMenu>
        <DropdownMenuItem
          onSelect={() => redirect(`/item/detail/${row.original.id}`)}
          className="cursor-pointer"
        >
          Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => setComponent(<DuplicateItem row={row} />)}
        >
          Duplicate Item
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => setComponent(<ItemForm item={row.original} />)}
        >
          Edit Item
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => setComponent(<EditContainers row={row} />)}
        >
          Edit Containers
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => alertButton.current?.click()}
        >
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
