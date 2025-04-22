"use client";

import { showPromiseToast } from "@/util/Toasts";
import { CellContext } from "@tanstack/react-table";
import React, { useState } from "react";
import { Input } from "../ui/input";
import ReadCell from "./ReadCell";

type HasId = {
  id: string;
};

export default function EditCell<
  T extends HasId,
  S extends string | number | undefined
>({ getValue, row, column: { id }, table }: CellContext<T, S>) {
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

      if (table.options.meta?.updateData == null) return;

      const action = table.options.meta.updateData.bind(null, objectId);

      const promise = () => action(updatedRow);

      showPromiseToast(promise, `Attempting to update row data`);
    }

    setIsEditing(false);
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
