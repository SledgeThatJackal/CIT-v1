"use client";

import { ReactNode, useState } from "react";
import { Button } from "../button";
import { Label } from "../label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../select";

export default function FieldsetSelect({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState<string | undefined>();

  return (
    <fieldset className="flex flex-row">
      <Label className="bg-accent-alternate p-2 rounded-l-lg text-nowrap">
        Base Report:
      </Label>
      <Select defaultValue={value} onValueChange={setValue}>
        <SelectTrigger className="rounded-none w-full">
          <SelectValue placeholder="Select a container" />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      <Button
        className="rounded-r-lg rounded-l-none hover:cursor-pointer"
        variant="secondary"
        disabled={value === undefined}
        onClick={() => onSubmit(value!)}
      >
        Generate
      </Button>
    </fieldset>
  );
}
