import { CellContext } from "@tanstack/react-table";

export default function BooleanCell<T, S>({ getValue }: CellContext<T, S>) {
  const isArea = getValue();

  return <div className="text-center">{isArea ? "✔️" : "❌"}</div>;
}
