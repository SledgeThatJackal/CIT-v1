"use client";

import DataTable from "@/components/table/DataTable";
import {
  createContainerImages,
  deleteContainerImage,
  updateContainer,
  updateContainerImageOrders,
} from "../actions/containers";
import { columns } from "../data/useTableData";

export default function ContainerDataTable({
  containers,
}: {
  containers: {
    id: string;
    name: string;
    barcodeId: string;
    isArea: boolean;
    parent: {
      id: string | null;
      name: string;
      barcodeId: string;
      isArea: boolean;
    } | null;
    containerImages: {
      id: string;
      image: {
        id: string;
        fileName: string;
      };
      imageOrder: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
    description?: string | undefined;
  }[];
}) {
  return (
    <DataTable
      data={containers}
      columns={columns}
      updateData={updateContainer}
      addImages={createContainerImages}
      reorderImages={updateContainerImageOrders}
      deleteImage={deleteContainerImage}
    />
  );
}
