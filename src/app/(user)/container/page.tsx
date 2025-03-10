import DataTable from "@/components/table/DataTable";
import { data, columns } from "@/features/containers/data/useTableData";

export default function Container() {
  return (
    <div className="container mx-auto py-10">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
