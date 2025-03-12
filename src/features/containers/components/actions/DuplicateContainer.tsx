import { Row } from "@tanstack/react-table";
import { ContainerType } from "../../schema/containers";

export default function DuplicateContainer({
  row,
}: {
  row: Row<ContainerType>;
}) {
  return <div>Duplicate</div>;
}
