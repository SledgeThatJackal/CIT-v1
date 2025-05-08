import { Row } from "@tanstack/react-table";
import { ItemType } from "../../schema/item";
import ContainerItemForm from "../ContainerItemForm";
import { updateContainerItems } from "../../actions/item";

export default function EditContainers({ row }: { row: Row<ItemType> }) {
  return (
    <ContainerItemForm
      id={row.original.id}
      containerItems={row.original.containerItems}
      saveContainerItems={updateContainerItems}
    />
  );
}
