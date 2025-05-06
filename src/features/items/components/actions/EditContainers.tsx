import { Row } from "@tanstack/react-table";
import { ItemType } from "../../schema/item";
import ContainerItemForm from "../ContainerItemForm";

export default function EditContainers({ row }: { row: Row<ItemType> }) {
  return <ContainerItemForm containerItems={row.original.containerItems} />;
}
