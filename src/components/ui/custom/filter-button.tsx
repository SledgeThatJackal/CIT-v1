"use client";

import { ListFilter } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

type HasNameAndId = {
  id: string;
  name: string;
};

export default function FilterButton<T extends HasNameAndId>({
  value,
  options,
  setValue,
  path = "id",
}: {
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  options: T[];
  path?: keyof T;
}) {
  const [key, setKey] = useState(+new Date());

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setValue(undefined);
    setKey(+new Date());
  }

  return (
    <Select key={key} defaultValue={value} onValueChange={setValue}>
      <SelectTrigger className="hover:cursor-pointer">
        <ListFilter />
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        <Button
          onClick={(e) => handleClick(e)}
          variant="ghost"
          className="w-full hover:cursor-pointer text-xs p-0"
          disabled={value === undefined}
        >
          Clear Filter
        </Button>
        <SelectGroup>
          {options &&
            options.length > 0 &&
            options.map((option) => (
              <SelectItem
                key={`select-${option.id}`}
                value={option[path] as string}
                className="hover:cursor-pointer"
              >
                {option.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
