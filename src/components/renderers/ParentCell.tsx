"use client";

import {
  ParentContainerType,
  ContainerType,
} from "@/features/containers/schema/containers";
import { CellContext } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useState } from "react";
import ReadCell from "./ReadCell";
import ComboboxCell from "./ComboboxCell";
import { updateContainer } from "@/features/containers/actions/containers";
import { showPromiseToast } from "@/util/Toasts";

export default function ParentCell({
  getValue,
  row,
}: CellContext<ContainerType, ParentContainerType | undefined>) {
  const parent = getValue();
  const [isEditing, setIsEditing] = useState(false);
  const [dataSet, setDataSet] = useState<ParentContainerType[]>([]);

  function handleBlur() {
    setIsEditing(false);
  }

  function handleSelect(value: string) {
    if (value == null) return;

    const updatedContainer = {
      name: row.original.name,
      description: row.original.description,
      barcodeId: row.original.barcodeId,
      isArea: row.original.isArea,
      parentId: value,
    };

    const action = updateContainer.bind(null, row.original.id);

    const promise = () => action(updatedContainer);

    showPromiseToast(
      promise,
      `Attempting to update Parent Container for ${row.original.name}`
    );

    setIsEditing(false);
  }

  async function fetchParentContainers(containerId: string, isArea: boolean) {
    const response = await fetch(
      `/api/container?id=${containerId}&isArea=${isArea}`
    );

    const data = await response.json();

    setDataSet(data.parentContainers);
  }

  useEffect(() => {
    if (isEditing) fetchParentContainers(row.original.id, row.original.isArea);
  }, [isEditing, row.original.id, row.original.isArea]);

  return (
    <React.Fragment>
      {isEditing ? (
        <ComboboxCell
          value={parent}
          displayPath="barcodeId"
          dataSet={dataSet}
          emptyStr="No suitable containers found"
          onSelect={handleSelect}
          onBlur={handleBlur}
        />
      ) : (
        <ReadCell
          value={parent?.barcodeId ?? ""}
          title="Double click to edit"
          func={() => setIsEditing(true)}
        />
      )}
    </React.Fragment>
  );
}
