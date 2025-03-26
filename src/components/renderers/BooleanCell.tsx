"use client";

import { updateContainer } from "@/features/containers/actions/containers";
import {
  ContainerType,
  CreateContainerType,
} from "@/features/containers/schema/containers";
import { showPromiseToast } from "@/util/Toasts";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CellContext } from "@tanstack/react-table";
import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import ReadCell from "./ReadCell";

type HasId = {
  id: string;
};

export default function BooleanCell<T extends HasId>({
  getValue,
  row,
  column: { id },
  table,
}: CellContext<T, boolean>) {
  const [isEditing, setIsEditing] = useState(false);
  const initialValue = getValue();
  const [isChecked, setIsChecked] = useState<CheckedState>(initialValue);

  function handleBlur() {
    const objectId = row.original.id;
    const updatedRow = { ...row.original, [id]: isChecked };

    const isContainer = findObjectType(row.original);
    let action;

    if (isContainer) {
      action = updateContainer.bind(null, objectId);
    } else {
      // Item
      action = (): Promise<{ message: string }> =>
        new Promise(() => {
          return { message: "IMPLEMENT ME" };
        });
      // action = updateItem.bind(null, objectId);
    }

    const promise = () => action(updatedRow as unknown as CreateContainerType);

    showPromiseToast(
      promise,
      `Attempting to update ${isContainer ? "container" : "item"}`
    );

    setIsEditing(false);
  }

  function findObjectType(obj: unknown) {
    return (obj as ContainerType)?.barcodeId !== undefined;
  }

  return (
    <React.Fragment>
      {isEditing ? (
        <div className="flex justify-center">
          <Checkbox
            autoFocus
            checked={isChecked}
            onCheckedChange={setIsChecked}
            onBlur={handleBlur}
          />
        </div>
      ) : (
        <ReadCell
          value={isChecked ? "✔️" : "❌"}
          title="Double click to edit"
          func={() => setIsEditing(true)}
          className="text-center"
        />
      )}
    </React.Fragment>
  );
}
