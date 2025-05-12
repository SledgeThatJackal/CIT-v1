import { Row } from "@tanstack/react-table";
import { ContainerType } from "../../schema/containers";
import ContainerForm from "../ContainerForm";

export default function DuplicateContainer({
  row,
}: {
  row: Row<ContainerType>;
}) {
  return <ContainerForm container={row.original} isDuplication />;
}
