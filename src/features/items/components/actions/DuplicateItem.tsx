import { Row } from "@tanstack/react-table";
import { ItemType } from "../../schema/item";
import ItemForm from "../ItemForm";

export default function DuplicateItem({ row }: { row: Row<ItemType> }) {
  return <ItemForm item={row.original} isDuplication />;
}
