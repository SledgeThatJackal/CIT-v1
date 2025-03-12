import { CellContext } from "@tanstack/react-table";

export default function EditCell<T, S>({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<T, S>) {
  const value = getValue();

  return <div>{String(value)}</div>;
}
