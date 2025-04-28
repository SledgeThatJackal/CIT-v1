"use client";

import ActionsMenu from "@/components/renderers/action/ActionsMenu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { changeToProperCase } from "@/util/formatters";
import { Check, ListFilter, X } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { DetailedTypeSchema } from "../schema/type";
import { TypeAttributeDataType } from "@/drizzle/schema";
import { ActionAlertDialog } from "@/components/ActionAlertDialog";
import { deleteTypeAttribute } from "../actions/type-attribute";
import TrashButton from "@/components/ui/custom/trash-button";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteType } from "../actions/type";

export default function TypeTable({ types }: { types: DetailedTypeSchema[] }) {
  const [index, setIndex] = useState(0);
  const alertButton = useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <div className="flex mb-2">
        <h1 className="self-center text-xl">{types[index]?.name}</h1>
        <div className="flex gap-2 items-center max-w-fit ms-auto">
          <Select defaultValue="0" onValueChange={(e) => setIndex(Number(e))}>
            <SelectTrigger className="hover:cursor-pointer rounded-none">
              <ListFilter />
              Filter
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {types &&
                  types.length > 0 &&
                  types.map((type, index) => (
                    <SelectItem key={`select-${type.id}`} value={`${index}`}>
                      {type.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ActionsMenu
            isVertical
            className="border rounded-none h-9 hover:cursor-pointer"
          >
            <DropdownMenuItem asChild>
              <Link href={`/type/create/${types[index]?.id}`}>Edit Type</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alertButton.current?.click()}>
              Delete Type
            </DropdownMenuItem>
          </ActionsMenu>
          <ActionAlertDialog
            action={deleteType.bind(null, types[index]?.id ?? "")}
            loading={`Attempting to delete type`}
          >
            <AlertDialogTrigger ref={alertButton} className="hidden" />
          </ActionAlertDialog>
        </div>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Default Value</TableHead>
            <TableHead>Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {types[index] && types[index].typeAttributes.length > 0 ? (
            types[index].typeAttributes.map((typeAttribute) => (
              <TableRow key={typeAttribute.id}>
                <TableCell>{typeAttribute.title}</TableCell>
                <TableCell>
                  {changeToProperCase(typeAttribute.dataType)}
                </TableCell>
                <DefaultValueCell
                  dataType={typeAttribute.dataType}
                  value={
                    typeAttribute.dataType === "string"
                      ? typeAttribute.textDefaultValue
                      : typeAttribute.numericDefaultValue
                  }
                ></DefaultValueCell>
                <TableCell>
                  <ActionAlertDialog
                    action={deleteTypeAttribute.bind(null, typeAttribute.id)}
                    loading={`Attempting to delete type attribute`}
                  >
                    <AlertDialogTrigger asChild>
                      <TrashButton />
                    </AlertDialogTrigger>
                  </ActionAlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="text-center text-lg">
                  No type attributes associated with this type
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

function DefaultValueCell({
  value,
  dataType,
}: {
  value: number | string | null | undefined;
  dataType: TypeAttributeDataType;
}) {
  switch (dataType) {
    case "boolean": {
      return <TableCell>{value === 0 ? <Check /> : <X />}</TableCell>;
    }
    case "number": {
      return <TableCell>{value}</TableCell>;
    }
    default: {
      <TableCell>{value}</TableCell>;
    }
  }
}
