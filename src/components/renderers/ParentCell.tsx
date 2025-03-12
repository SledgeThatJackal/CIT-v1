import { ParentContainerType } from "@/features/containers/schema/containers";
import { CellContext } from "@tanstack/react-table";

export default function ParentCell<T, S>({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<T, S>) {
  const parent = getValue() as ParentContainerType;

  return <div>{parent?.barcodeId}</div>;
}
