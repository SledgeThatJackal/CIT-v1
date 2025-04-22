import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateData: (id: string, data: any) => Promise<{ message: string }>;
    addImages?: (id: string, ids: string[]) => Promise<{ message: string }>;
    reorderImages?: (ids: string[]) => Promise<{ message: string }>;
    deleteImage?: (id: string) => Promise<{ message: string }>;
  }
}
