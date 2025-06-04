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
import { deleteContainer } from "../../actions/containers";
import { ContainerType } from "../../schema/containers";
import AddDescendant from "./AddDescendant";
import CreateItem from "./CreateItem";
import DuplicateContainer from "./DuplicateContainer";

export default function ActionsContainerCell<S>({
  row,
}: CellContext<ContainerType, S>) {
  const [component, setComponent] = useState<ReactNode>(undefined);
  const [title, setTitle] = useState<string | undefined>();
  const alertButton = useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <ActionsMenu>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() =>
            redirect(`/container/detail/${row.original.barcodeId}`)
          }
        >
          Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            setComponent(<DuplicateContainer row={row} />);
            setTitle(`Duplicating ${row.original.name}`);
          }}
        >
          Duplicate Container
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            setComponent(<CreateItem row={row} />);
            setTitle(`Creating Item for ${row.original.name}`);
          }}
        >
          Create Item
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            setComponent(<AddDescendant row={row} />);
            setTitle(`Adding descendants to ${row.original.name}`);
          }}
        >
          Add Descendant
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => alertButton.current?.click()}
        >
          Delete Container
        </DropdownMenuItem>
      </ActionsMenu>
      <ActionDialog title={title}>{component}</ActionDialog>
      <ActionAlertDialog
        action={deleteContainer.bind(null, row.original.id)}
        loading={`Attempting to delete container: ${row.original.name}`}
      >
        <AlertDialogTrigger ref={alertButton} className="hidden" />
      </ActionAlertDialog>
    </React.Fragment>
  );
}
