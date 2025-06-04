"use client";

import { ActionAlertDialog } from "@/components/ActionAlertDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import TrashButton from "@/components/ui/custom/trash-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTag, updateTag } from "../actions/tag";
import Tag from "./Tag";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateTagType } from "../schema/tag";
import { showPromiseToast } from "@/util/Toasts";
import { cn } from "@/lib/utils";

export default function TagTable({
  tags,
}: {
  tags: {
    id: string;
    name: string;
    description?: string;
    color: string;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Preview</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.length > 0 &&
          tags.sort().map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <Tag tag={tag} />
              </TableCell>
              <TableCell>
                <EditCell id={tag.id} data={tag} path="name" />
              </TableCell>
              <TableCell>
                <EditCell id={tag.id} data={tag} path="description" />
              </TableCell>
              <TableCell>
                <EditCell id={tag.id} data={tag} path="color" type="color" />
              </TableCell>
              <TableCell>
                <ActionAlertDialog
                  action={deleteTag.bind(null, tag.id)}
                  loading={`Attempting to delete tag`}
                >
                  <AlertDialogTrigger asChild>
                    <TrashButton />
                  </AlertDialogTrigger>
                </ActionAlertDialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

function EditCell<T extends CreateTagType>({
  id,
  data,
  path,
  type = "text",
}: {
  id: string;
  data: T;
  path: keyof T;
  type?: string;
}) {
  const [isViewing, setIsViewing] = useState(false);
  const [value, setValue] = useState(String(data[path]));

  function onBlur() {
    const action = updateTag.bind(null, id);

    const updatedData = { ...data, [path]: value };

    const promise = () => action(updatedData);

    showPromiseToast(promise, "Attempting to update tag", () =>
      setIsViewing(false)
    );
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onBlur();

    if (e.key === "Escape") {
      setValue(String(data[path]));

      setIsViewing(false);
      e.preventDefault();
    }
  }

  return (
    <React.Fragment>
      {isViewing ? (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          type={type}
          onKeyDown={onKeyDown}
        />
      ) : (
        <div
          title="Double click to edit"
          onDoubleClick={() => setIsViewing(true)}
          className={cn(value.length === 0 && "h-5")}
        >
          {value}
        </div>
      )}
    </React.Fragment>
  );
}
