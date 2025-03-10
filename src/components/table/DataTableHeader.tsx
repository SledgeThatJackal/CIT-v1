import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";

interface DataTableHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export default function DataTableHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableHeaderProps<TData, TValue>) {
  return <div className={cn(className)}>{title}</div>;
}
