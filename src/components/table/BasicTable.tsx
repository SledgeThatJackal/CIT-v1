import { changeToProperCase } from "@/util/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function BasicTable<T extends { id: string }>({
  data,
}: {
  data: T[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Object.entries(data[0] ?? {})
            .filter(([key]) => key !== "id")
            .map(([key]) => (
              <TableHead key={`header-${key}`}>
                {changeToProperCase(key)}
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 &&
          data.map((row) => (
            <TableRow key={row.id}>
              {Object.entries(row)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <TableCell key={`cell-${row.id}-${key}`}>{value}</TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
