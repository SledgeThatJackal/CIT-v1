"use client";

import { CellContext } from "@tanstack/react-table";
import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import ReadCell from "./ReadCell";
import {
  ContainerType,
  CreateContainerType,
} from "@/features/containers/schema/containers";
import { updateContainer } from "@/features/containers/actions/containers";
import { showPromiseToast } from "@/util/Toasts";

type HasId = {
  id: string;
};

export default function EditCell<
  T extends HasId,
  S extends string | number | undefined
>({ getValue, row, column: { id } }: CellContext<T, S>) {
  const initialValue = getValue();

  const [value, setValue] = useState<string | number | undefined>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  function handleDoubleClick() {
    setIsEditing(true);
    setIsCancelled(false);
  }

  function handleBlur() {
    if (!isCancelled) {
      const objectId = row.original.id;
      const updatedRow = { ...row.original, [id]: value };
      let action;

      const isContainer = findObjectType(row.original);

      if (isContainer) {
        // Container
        action = updateContainer.bind(null, objectId);
      } else {
        // Item
        action = (): Promise<{ message: string }> =>
          new Promise(() => {
            return { message: "IMPLEMENT ME" };
          });
        // action = updateItem.bind(null, objectId);
      }

      const promise = () =>
        action(updatedRow as unknown as CreateContainerType);

      showPromiseToast(
        promise,
        `Attempting to update ${isContainer ? "container" : "item"}`
      );
    }

    setIsEditing(false);
  }

  function findObjectType(obj: unknown) {
    return (obj as ContainerType)?.barcodeId !== undefined;
  }

  function handleKeyDown(e: React.KeyboardEvent<unknown>) {
    if (e.key === "Enter") handleBlur();

    if (e.key === "Escape") {
      setIsCancelled(true);
      setIsEditing(false);
    }
  }

  return (
    <React.Fragment>
      {isEditing ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <ReadCell
          value={value}
          title="Double click to edit"
          func={handleDoubleClick}
        />
      )}
    </React.Fragment>
  );
}
